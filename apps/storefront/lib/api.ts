import { imagePath } from "./format"
import type {
  ProductMetadata,
  StoreCategory,
  StoreProduct,
  StoreVariant,
} from "./types"

export const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"

export const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

const PRODUCT_FIELDS = [
  "*variants.calculated_price",
  "*variants.options",
  "*options",
  "*images",
  "*collection",
  "*categories",
].join(",")

type ProductResponse = {
  products: Omit<StoreProduct, "price" | "totalStock" | "stockBySku" | "metadata">[]
}

type MetaResponse = {
  products: {
    id: string
    handle: string
    metadata: ProductMetadata | null
    variants: { id: string; sku: string }[]
  }[]
}

type StockResponse = {
  stock: Record<string, number>
}

type RegionResponse = {
  regions: {
    id: string
    currency_code: string
    countries?: { iso_2: string }[]
  }[]
}

export function storeHeaders(): Record<string, string> {
  return PUBLISHABLE_KEY
    ? { "x-publishable-api-key": PUBLISHABLE_KEY }
    : {}
}

export async function storeFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
    ...init,
    headers: {
      ...storeHeaders(),
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Store API ${response.status}: ${message.slice(0, 300)}`)
  }

  return response.json() as Promise<T>
}

function normaliseVariant(variant: StoreVariant): StoreVariant {
  return {
    ...variant,
    calculated_price: variant.calculated_price ?? undefined,
  }
}

export async function getCatalog(): Promise<StoreProduct[]> {
  const [productData, metaData, stockData] = await Promise.all([
    storeFetch<ProductResponse>(
      `/store/products?limit=100&fields=${encodeURIComponent(PRODUCT_FIELDS)}`
    ),
    storeFetch<MetaResponse>("/store/jsb/meta").catch(
      (): MetaResponse => ({ products: [] })
    ),
    storeFetch<StockResponse>("/store/jsb/stock").catch(
      (): StockResponse => ({ stock: {} })
    ),
  ])

  const metadataByProduct = new Map(
    metaData.products.map((product) => [product.id, product.metadata])
  )
  const stock = stockData.stock ?? {}

  return productData.products
    .map((product) => {
      const variants = (product.variants ?? []).map((variant) =>
        normaliseVariant(variant)
      )
      const stockBySku = variants.reduce<Record<string, number>>(
        (acc, variant) => {
          acc[variant.sku] = stock[variant.sku] ?? 0
          return acc
        },
        {}
      )
      const prices = variants
        .map((variant) => variant.calculated_price?.calculated_amount)
        .filter((price): price is number => typeof price === "number")
      const price = prices.length ? Math.min(...prices) : 0
      const totalStock = Object.values(stockBySku).reduce(
        (sum, quantity) => sum + quantity,
        0
      )
      const images = (product.images ?? []).map((image) => ({
        ...image,
        url: imagePath(image.url),
      }))

      return {
        ...product,
        thumbnail: imagePath(product.thumbnail ?? images[0]?.url),
        images,
        variants,
        metadata: metadataByProduct.get(product.id) ?? undefined,
        price,
        totalStock,
        stockBySku,
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title))
}

export async function getProduct(
  handle: string
): Promise<StoreProduct | null> {
  const catalog = await getCatalog()
  return catalog.find((product) => product.handle === handle) ?? null
}

export async function getCategories(): Promise<StoreCategory[]> {
  const catalog = await getCatalog()
  const categories = new Map<string, StoreCategory>()

  for (const product of catalog) {
    for (const category of product.categories ?? []) {
      if (!categories.has(category.handle)) {
        categories.set(category.handle, category)
      }
    }
  }

  const rank = ["uniforms", "casual-daily", "party", "formal", "ethnic"]

  return Array.from(categories.values()).sort(
    (a, b) => rank.indexOf(a.handle) - rank.indexOf(b.handle)
  )
}

export async function getRegionId(): Promise<string> {
  const data = await storeFetch<RegionResponse>("/store/regions")
  const indianRegion = data.regions.find(
    (region) =>
      region.currency_code === "inr" ||
      region.countries?.some((country) => country.iso_2 === "in")
  )

  if (!indianRegion) {
    throw new Error("No INR region is configured in Medusa.")
  }

  return indianRegion.id
}

