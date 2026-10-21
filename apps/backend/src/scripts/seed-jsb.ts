import type { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createTaxRatesWorkflow,
  createTaxRegionsWorkflow,
  deleteFulfillmentSetsWorkflow,
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
  deleteRegionsWorkflow,
  deleteShippingOptionsWorkflow,
  deleteTaxRegionsWorkflow,
  updateApiKeysWorkflow,
  updateRegionsWorkflow,
  updateSalesChannelsWorkflow,
  updateStoresWorkflow,
  updateStockLocationsWorkflow,
  updateTaxRatesWorkflow,
} from "@medusajs/medusa/core-flows"

type SeedProduct = {
  title: string
  handle: string
  category: string
  price: number
  fabric: string
  fit: string
  care: string
  description: string
  colors: string[]
  sizes: string[]
  images: number[]
  isNew: boolean
  collection: string
  stockNote: string
}

const STOREFRONT_URL = process.env.JSB_STOREFRONT_URL || "http://localhost:3000"
const image = (id: number) => `${STOREFRONT_URL}/products/${id}.jpg`

const categories = [
  {
    name: "Uniforms",
    handle: "uniforms",
    description: "Crisp, considered pieces built for campus days and working hours.",
  },
  {
    name: "Casual / Daily Wear",
    handle: "casual-daily",
    description: "Relaxed layers, soft cottons and everyday essentials with a sharper point of view.",
  },
  {
    name: "Party",
    handle: "party",
    description: "After-dark pieces with a little shine, a little drama and a lot of presence.",
  },
  {
    name: "Formal",
    handle: "formal",
    description: "Tailoring and polished separates for rooms that call for your best.",
  },
  {
    name: "Ethnic",
    handle: "ethnic",
    description: "Modern Indian silhouettes, festive textures and heirloom details.",
  },
]

const products: SeedProduct[] = [
  {
    title: "Academy Polo",
    handle: "academy-polo",
    category: "uniforms",
    price: 1249,
    fabric: "Combed cotton piqué",
    fit: "Regular",
    care: "Machine wash cold, line dry",
    description:
      "A clean-lined polo with a dense cotton hand-feel and a collar that holds its shape from first period to last. Made for repeat wear.",
    colors: ["Ink", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [39915480, 8483478],
    isNew: false,
    collection: "Everyday Edit",
    stockNote: "Core uniform fit",
  },
  {
    title: "Campus Blazer",
    handle: "campus-blazer",
    category: "uniforms",
    price: 3999,
    fabric: "Poly-wool twill",
    fit: "Tailored",
    care: "Dry clean only",
    description:
      "A structured blazer with a soft shoulder and enough room to layer. The kind of uniform piece that looks equally right outside the gate.",
    colors: ["Charcoal", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    images: [13065308, 34411762],
    isNew: true,
    collection: "New Arrivals",
    stockNote: "Limited first run",
  },
  {
    title: "Civic Formal Shirt",
    handle: "civic-formal-shirt",
    category: "uniforms",
    price: 1399,
    fabric: "Cotton poplin",
    fit: "Slim",
    care: "Machine wash cold, warm iron",
    description:
      "An everyday formal shirt with a neat point collar and a smooth poplin finish. Designed to stay sharp through long days.",
    colors: ["Sky Blue", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [18186107, 22441295],
    isNew: false,
    collection: "Everyday Edit",
    stockNote: "Restocked",
  },
  {
    title: "Studio Tee",
    handle: "studio-tee",
    category: "casual-daily",
    price: 899,
    fabric: "240 GSM organic cotton",
    fit: "Relaxed",
    care: "Machine wash cold, inside out",
    description:
      "A heavyweight tee with a dry, compact surface and a relaxed drape. Cut clean at the neck and hem so it works under everything.",
    colors: ["Black", "Sand"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [28079577, 39915480],
    isNew: true,
    collection: "New Arrivals",
    stockNote: "Best seller",
  },
  {
    title: "Everyday Oxford",
    handle: "everyday-oxford",
    category: "casual-daily",
    price: 1899,
    fabric: "Cotton oxford",
    fit: "Relaxed",
    care: "Machine wash cold, line dry",
    description:
      "The shirt you reach for without thinking. A softly structured oxford with a generous body, natural roll at the collar and an easy finish.",
    colors: ["White", "Blue"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [22441297, 18186107],
    isNew: false,
    collection: "Everyday Edit",
    stockNote: "Wardrobe essential",
  },
  {
    title: "Ridge Overshirt",
    handle: "ridge-overshirt",
    category: "casual-daily",
    price: 2799,
    fabric: "Brushed cotton twill",
    fit: "Boxy",
    care: "Machine wash cold, line dry",
    description:
      "A shirt-jacket with a brushed hand and a quietly utilitarian attitude. Wear it open over a tee or buttoned as a light layer.",
    colors: ["Olive", "Stone"],
    sizes: ["S", "M", "L", "XL"],
    images: [15451683, 8483478],
    isNew: true,
    collection: "New Arrivals",
    stockNote: "New season",
  },
  {
    title: "Linen Camp Shirt",
    handle: "linen-camp-shirt",
    category: "casual-daily",
    price: 1999,
    fabric: "Washed European linen",
    fit: "Relaxed",
    care: "Machine wash cold, warm iron",
    description:
      "A breathable camp-collar shirt in washed linen, made for slow weekends and warm evenings. The texture only gets better with wear.",
    colors: ["Natural", "Ink"],
    sizes: ["S", "M", "L", "XL"],
    images: [22441297, 28079577],
    isNew: true,
    collection: "New Arrivals",
    stockNote: "Summer weight",
  },
  {
    title: "Sunday Co-ord",
    handle: "sunday-co-ord",
    category: "casual-daily",
    price: 2999,
    fabric: "Cotton jersey",
    fit: "Easy",
    care: "Machine wash cold, line dry",
    description:
      "A matched set built around ease: a clean crew tee and a relaxed bottom in the same soft jersey. One decision, a complete outfit.",
    colors: ["Ecru", "Charcoal"],
    sizes: ["S", "M", "L", "XL"],
    images: [9775479, 14302017],
    isNew: false,
    collection: "Everyday Edit",
    stockNote: "Set of two",
  },
  {
    title: "Noir Satin Shirt",
    handle: "noir-satin-shirt",
    category: "party",
    price: 3299,
    fabric: "Recycled satin",
    fit: "Relaxed",
    care: "Hand wash cold, line dry",
    description:
      "A fluid satin shirt with a low sheen and a soft collar. Throw it on with denim for a dinner or with tailoring for something later.",
    colors: ["Black", "Maroon"],
    sizes: ["S", "M", "L", "XL"],
    images: [11576958, 35661024],
    isNew: false,
    collection: "Occasion",
    stockNote: "Evening edit",
  },
  {
    title: "Muse Slip Dress",
    handle: "muse-slip-dress",
    category: "party",
    price: 3599,
    fabric: "Cupro satin",
    fit: "Bias cut",
    care: "Hand wash cold, line dry",
    description:
      "A bias-cut slip dress that moves with the body and catches the light just enough. Adjustable straps and a clean neckline keep it modern.",
    colors: ["Ivory", "Rose"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [17697702, 9558265],
    isNew: true,
    collection: "New Arrivals",
    stockNote: "Occasion ready",
  },
  {
    title: "Velvet Column Dress",
    handle: "velvet-column-dress",
    category: "party",
    price: 6499,
    fabric: "Stretch velvet",
    fit: "Column",
    care: "Dry clean only",
    description:
      "A floor-skimming column in deep-pile velvet, cut with a clean neckline and a touch of stretch. Quiet drama, no noise required.",
    colors: ["Black", "Rust"],
    sizes: ["XS", "S", "M", "L"],
    images: [3310694, 35661024],
    isNew: false,
    collection: "Occasion",
    stockNote: "Limited run",
  },
  {
    title: "Blue Hour Gown",
    handle: "blue-hour-gown",
    category: "party",
    price: 5499,
    fabric: "Recycled crepe",
    fit: "Column",
    care: "Dry clean only",
    description:
      "A saturated blue gown with a sculptural drape and an open back. Made for the hour when the room goes quiet.",
    colors: ["Cobalt", "Ink"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [13153053, 3310694],
    isNew: true,
    collection: "New Arrivals",
    stockNote: "Statement piece",
  },
  {
    title: "Meridian Blazer",
    handle: "meridian-blazer",
    category: "formal",
    price: 5999,
    fabric: "Italian wool blend",
    fit: "Tailored",
    care: "Dry clean only",
    description:
      "A single-breasted blazer with a clean line through the waist and a natural shoulder. Tailoring that feels relaxed, not rented.",
    colors: ["Navy", "Charcoal"],
    sizes: ["S", "M", "L", "XL"],
    images: [8605799, 28938768],
    isNew: false,
    collection: "Occasion",
    stockNote: "Tailored fit",
  },
  {
    title: "Atelier Pleated Trouser",
    handle: "atelier-pleated-trouser",
    category: "formal",
    price: 2899,
    fabric: "Wool-blend suiting",
    fit: "Wide leg",
    care: "Dry clean only",
    description:
      "A high-rise pleated trouser with a long, clean break. The kind of pair that makes a simple shirt look considered.",
    colors: ["Charcoal", "Sand"],
    sizes: ["S", "M", "L", "XL"],
    images: [5872320, 35618954],
    isNew: false,
    collection: "Occasion",
    stockNote: "Tailored fit",
  },
  {
    title: "Signature Ivory Shirt",
    handle: "signature-ivory-shirt",
    category: "formal",
    price: 2199,
    fabric: "Giza cotton",
    fit: "Regular",
    care: "Machine wash cold, warm iron",
    description:
      "A warm ivory shirt in long-staple cotton with a subtle lustre and a precise cut. It quietly does the work of a whole outfit.",
    colors: ["Ivory", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [22441295, 22441297],
    isNew: false,
    collection: "Everyday Edit",
    stockNote: "Signature staple",
  },
  {
    title: "Kora Cotton Kurta",
    handle: "kora-cotton-kurta",
    category: "ethnic",
    price: 2499,
    fabric: "Handloom kora cotton",
    fit: "Straight",
    care: "Dry clean recommended",
    description:
      "A straight kurta in textured kora cotton with a soft mandarin collar and hand-finished details. Festive without trying too hard.",
    colors: ["Chestnut", "Ivory"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [17901285, 29138637],
    isNew: true,
    collection: "New Arrivals",
    stockNote: "Handloom weave",
  },
  {
    title: "Bandhgala Jacket",
    handle: "bandhgala-jacket",
    category: "ethnic",
    price: 7499,
    fabric: "Silk-wool brocade",
    fit: "Tailored",
    care: "Dry clean only",
    description:
      "A sharp bandhgala with a structured collar and a rich, tonal brocade. The shortcut to looking completely put together at a wedding.",
    colors: ["Gold", "Ink"],
    sizes: ["S", "M", "L", "XL"],
    images: [13266800, 29138637],
    isNew: false,
    collection: "Occasion",
    stockNote: "Made to celebrate",
  },
  {
    title: "Heritage Nehru Jacket",
    handle: "heritage-nehru-jacket",
    category: "ethnic",
    price: 4299,
    fabric: "Cotton silk",
    fit: "Straight",
    care: "Dry clean only",
    description:
      "A clean Nehru jacket in cotton silk, cut to layer over kurtas and shirts alike. Traditional lines, a lighter hand.",
    colors: ["Black", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    images: [8770958, 17901285],
    isNew: true,
    collection: "New Arrivals",
    stockNote: "Layer piece",
  },
  {
    title: "Silk Bandhani Dupatta",
    handle: "silk-bandhani-dupatta",
    category: "ethnic",
    price: 1799,
    fabric: "Silk blend",
    fit: "2.5 metres",
    care: "Dry clean only",
    description:
      "A featherlight dupatta with a traditional bandhani pattern and a soft zari edge. The quickest way to bring colour into a quiet outfit.",
    colors: ["Rani Pink", "Indigo"],
    sizes: ["One Size"],
    images: [13162238, 13266800],
    isNew: false,
    collection: "Occasion",
    stockNote: "Hand-finished edge",
  },
]

const colorCode = (color: string) => {
  const codes: Record<string, string> = {
    Ink: "ink",
    White: "white",
    Charcoal: "charcoal",
    Navy: "navy",
    "Sky Blue": "sky-blue",
    Black: "black",
    Sand: "sand",
    Olive: "olive",
    Stone: "stone",
    Natural: "natural",
    Ecru: "ecru",
    Maroon: "maroon",
    Ivory: "ivory",
    Rose: "rose",
    Rust: "rust",
    Cobalt: "cobalt",
    Chestnut: "chestnut",
    Gold: "gold",
    "Rani Pink": "rani-pink",
    Indigo: "indigo",
  }

  return codes[color] || "natural"
}

const variantSku = (handle: string, color: string, size: string) =>
  `JSB-${handle}-${color}-${size}`.replace(/\s+/g, "-").toUpperCase()

export default async function seedJsb({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  )

  logger.info("Preparing JSB SONS storefront data")

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const templateHandles = new Set(["t-shirt", "sweatshirt", "sweatpants", "shorts"])
  const templateProductIds = existingProducts
    .filter((product) => templateHandles.has(product.handle))
    .map((product) => product.id)

  if (templateProductIds.length) {
    await deleteProductsWorkflow(container).run({
      input: { ids: templateProductIds },
    })
    logger.info("Removed starter products")
  }

  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
  })
  const starterCategoryHandles = new Set(["shirts", "sweatshirts", "pants", "merch"])
  const starterCategoryIds = existingCategories
    .filter((category) => starterCategoryHandles.has(category.handle))
    .map((category) => category.id)

  if (starterCategoryIds.length) {
    await deleteProductCategoriesWorkflow(container).run({
      input: starterCategoryIds,
    })
    logger.info("Removed starter categories")
  }

  const { data: existingShippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name"],
  })
  const starterShippingOptionIds = existingShippingOptions
    .filter((option) =>
      ["Standard Shipping", "Express Shipping"].includes(option.name)
    )
    .map((option) => option.id)

  if (starterShippingOptionIds.length) {
    await deleteShippingOptionsWorkflow(container).run({
      input: { ids: starterShippingOptionIds },
    })
    logger.info("Removed starter shipping options")
  }

  const { data: existingFulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name"],
  })
  const starterFulfillmentSetIds = existingFulfillmentSets
    .filter((set) => set.name === "European Warehouse delivery")
    .map((set) => set.id)

  if (starterFulfillmentSetIds.length) {
    await deleteFulfillmentSetsWorkflow(container).run({
      input: { ids: starterFulfillmentSetIds },
    })
    logger.info("Removed starter fulfillment set")
  }

  const { data: existingTaxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code"],
  })
  const nonIndiaTaxRegionIds = existingTaxRegions
    .filter((region) => region.country_code !== "in")
    .map((region) => region.id)

  if (nonIndiaTaxRegionIds.length) {
    await deleteTaxRegionsWorkflow(container).run({
      input: { ids: nonIndiaTaxRegionIds },
    })
    logger.info("Removed starter tax regions")
  }

  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
  })
  const starterRegionIds = existingRegions
    .filter((region) => region.name === "Europe")
    .map((region) => region.id)

  if (starterRegionIds.length) {
    await deleteRegionsWorkflow(container).run({
      input: { ids: starterRegionIds },
    })
    logger.info("Removed starter region")
  }

  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })
  const stockLocation = stockLocations[0]

  if (!stockLocation) {
    throw new Error("No stock location found. Run the initial data seed first.")
  }

  await updateStockLocationsWorkflow(container).run({
    input: {
      selector: { id: stockLocation.id },
      update: {
        name: "JSB SONS Atelier — Sadar Bazar, Gurugram",
        address: {
          address_1: "122/3, opp. Head Post Office",
          address_2: "Sadar Bazar, Sector 12",
          city: "Gurugram",
          province: "Haryana",
          postal_code: "122001",
          country_code: "IN",
        },
      },
    },
  })

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  const salesChannel = salesChannels[0]

  if (!salesChannel) {
    throw new Error("No sales channel found. Run the initial data seed first.")
  }

  await updateSalesChannelsWorkflow(container).run({
    input: {
      selector: { id: salesChannel.id },
      update: {
        name: "JSB SONS Online",
        description: "Direct-to-customer storefront for JSB SONS.",
      },
    },
  })

  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "title", "type"],
  })
  const publishableKey = apiKeys.find((key) => key.type === "publishable")

  if (publishableKey) {
    await updateApiKeysWorkflow(container).run({
      input: {
        selector: { id: publishableKey.id },
        update: { title: "JSB SONS Storefront" },
      },
    })
  }

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id"],
  })
  const store = stores[0]

  if (!store) {
    throw new Error("No store found. Run the initial data seed first.")
  }

  const { data: currentRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
  })
  let regionId = currentRegions.find(
    (item) => item.currency_code === "inr"
  )?.id

  if (!regionId) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "India",
            currency_code: "inr",
            countries: ["in"],
            payment_providers: ["pp_system_default"],
            is_tax_inclusive: true,
          },
        ],
      },
    })
    regionId = result[0].id
    logger.info("Created India region")
  } else {
    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: regionId },
        update: {
          name: "India",
          countries: ["in"],
          payment_providers: ["pp_system_default"],
          is_tax_inclusive: true,
        },
      },
    })
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "JSB SONS",
        supported_currencies: [{ currency_code: "inr", is_default: true }],
        default_region_id: regionId,
        default_location_id: stockLocation.id,
        default_sales_channel_id: salesChannel.id,
      },
    },
  })

  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code"],
  })
  let taxRegionId = taxRegions.find(
    (item) => item.country_code === "in"
  )?.id

  if (!taxRegionId) {
    const { result } = await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "in", provider_id: "tp_system" }],
    })
    taxRegionId = result[0].id
    logger.info("Created India tax region")
  }

  const { data: taxRates } = await query.graph({
    entity: "tax_rate",
    fields: ["id", "tax_region_id", "rate", "is_default"],
  })
  const existingIndiaRate = taxRates.find(
    (rate) => rate.tax_region_id === taxRegionId
  )

  if (!existingIndiaRate) {
    await createTaxRatesWorkflow(container).run({
      input: [
        {
          tax_region_id: taxRegionId,
          name: "GST",
          code: "GST",
          rate: 5,
          is_default: true,
        },
      ],
    })
    logger.info("Created 5% GST rate")
  } else if (existingIndiaRate.rate !== 5) {
    await updateTaxRatesWorkflow(container).run({
      input: {
        selector: { id: existingIndiaRate.id },
        update: { rate: 5, is_default: true },
      },
    })
  }

  const { data: currentFulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name"],
  })
  type SeedFulfillmentSet = {
    id: string
    name: string
    service_zones: { id: string }[]
  }

  let fulfillmentSet: SeedFulfillmentSet | undefined = currentFulfillmentSets.find(
    (set) => set.name === "JSB SONS India delivery"
  ) as SeedFulfillmentSet | undefined

  if (!fulfillmentSet) {
    const createdFulfillmentSet =
      await fulfillmentModuleService.createFulfillmentSets({
        name: "JSB SONS India delivery",
        type: "shipping",
        service_zones: [
          {
            name: "India",
            geo_zones: [{ country_code: "in", type: "country" }],
          },
        ],
      })

    fulfillmentSet = createdFulfillmentSet as unknown as SeedFulfillmentSet

    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    })
    logger.info("Created India fulfillment set")
  }

  const { data: currentShippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name"],
  })
  const hasStandard = currentShippingOptions.some(
    (option) => option.name === "Standard Delivery"
  )
  const hasExpress = currentShippingOptions.some(
    (option) => option.name === "Express Delivery"
  )

  if (!hasStandard || !hasExpress) {
    const serviceZoneId = fulfillmentSet?.service_zones?.[0]?.id

    if (!serviceZoneId) {
      throw new Error("India fulfillment set has no service zone")
    }

    const { data: shippingProfiles } = await query.graph({
      entity: "shipping_profile",
      fields: ["id"],
    })
    const shippingProfile = shippingProfiles[0]

    if (!shippingProfile) {
      throw new Error("No shipping profile found")
    }

    type ShippingOptionSeed = {
      name: string
      price_type: "flat"
      provider_id: string
      service_zone_id: string
      shipping_profile_id: string
      type: { label: string; description: string; code: string }
      prices: { region_id: string; amount: number }[]
      rules: {
        attribute: string
        value: string
        operator: "eq"
      }[]
    }

    const shippingOptions: ShippingOptionSeed[] = []
    if (!hasStandard) {
      shippingOptions.push({
        name: "Standard Delivery",
        price_type: "flat" as const,
        provider_id: "manual_manual",
        service_zone_id: serviceZoneId,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Dispatch in 24–48 hours. Delivery in 4–7 working days.",
          code: "standard",
        },
        prices: [{ region_id: regionId, amount: 99 }],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
          { attribute: "is_return", value: "false", operator: "eq" as const },
        ],
      })
    }
    if (!hasExpress) {
      shippingOptions.push({
        name: "Express Delivery",
        price_type: "flat" as const,
        provider_id: "manual_manual",
        service_zone_id: serviceZoneId,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Priority dispatch. Delivery in 2–3 working days.",
          code: "express",
        },
        prices: [{ region_id: regionId, amount: 199 }],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
          { attribute: "is_return", value: "false", operator: "eq" as const },
        ],
      })
    }

    await createShippingOptionsWorkflow(container).run({
      input: shippingOptions,
    })
    logger.info("Created JSB SONS shipping options")
  }

  const { data: currentCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
  })
  const missingCategories = categories.filter(
    (category) =>
      !currentCategories.some((existing) => existing.handle === category.handle)
  )

  if (missingCategories.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map((category) => ({
          name: category.name,
          handle: category.handle,
          description: category.description,
          is_active: true,
        })),
      },
    })
  }

  const { data: allCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
  })
  const categoryMap = new Map(
    allCategories.map((category) => [category.handle, category.id])
  )

  const { data: currentCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title"],
  })
  const collectionTitles = ["New Arrivals", "Everyday Edit", "Occasion"]
  const missingCollections = collectionTitles.filter(
    (title) => !currentCollections.some((collection) => collection.title === title)
  )

  if (missingCollections.length) {
    await createCollectionsWorkflow(container).run({
      input: {
        collections: missingCollections.map((title) => ({
          title,
          handle: title.toLowerCase().replace(/\s+/g, "-"),
        })),
      },
    })
  }

  const { data: allCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title"],
  })
  const collectionMap = new Map(
    allCollections.map((collection) => [collection.title, collection.id])
  )

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles[0]

  if (!shippingProfile) {
    throw new Error("No shipping profile found")
  }

  const { data: productsAfterSeeding } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const existingHandles = new Set(
    productsAfterSeeding.map((product) => product.handle)
  )
  const missingProducts = products.filter(
    (product) => !existingHandles.has(product.handle)
  )

  if (missingProducts.length) {
    const { result: createdProducts } = await createProductsWorkflow(container).run({
      input: {
        products: missingProducts.map((product) => {
          const categoryId = categoryMap.get(product.category)
          const collectionId = collectionMap.get(product.collection)

          return {
            title: product.title,
            handle: product.handle,
            subtitle: `${product.fabric} · ${product.fit}`,
            description: product.description,
            status: ProductStatus.PUBLISHED,
            thumbnail: image(product.images[0]),
            images: product.images.map((id) => ({ url: image(id) })),
            weight: 450,
            shipping_profile_id: shippingProfile.id,
            category_ids: categoryId ? [categoryId] : [],
            collection_id: collectionId,
            sales_channels: [{ id: salesChannel.id }],
            metadata: {
              fabric: product.fabric,
              fit: product.fit,
              care: product.care,
              origin: "Made in India",
              delivery: "Dispatched within 24–48 hours",
              is_new: product.isNew,
              color_family: product.colors.map(colorCode),
              stock_note: product.stockNote,
              collection_label: product.collection,
            },
            options: [
              {
                title: "Size",
                values: product.sizes,
                is_exclusive: true,
              },
              {
                title: "Colour",
                values: product.colors,
                is_exclusive: true,
              },
            ],
            variants: product.colors.flatMap((color) =>
              product.sizes.map((size) => ({
                title: `${color} / ${size}`,
                sku: variantSku(product.handle, color, size),
                manage_inventory: true,
                allow_backorder: false,
                options: { Size: size, Colour: color },
                prices: [{ currency_code: "inr", amount: product.price }],
              }))
            ),
          }
        }) as never,
      },
    })
    logger.info(`Created ${createdProducts.length} JSB SONS products`)
  }

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })
  const { data: inventoryLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["id", "inventory_item_id", "location_id"],
  })
  const levelledItems = new Set(
    inventoryLevels
      .filter((level) => level.location_id === stockLocation.id)
      .map((level) => level.inventory_item_id)
  )
  const missingLevels = inventoryItems.filter((item) => !levelledItems.has(item.id))

  if (missingLevels.length) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: missingLevels.map((item, index) => ({
          location_id: stockLocation.id,
          inventory_item_id: item.id,
          stocked_quantity: index === 0 ? 0 : 12 + (index % 24),
        })),
      },
    })
    logger.info(`Added inventory for ${missingLevels.length} variants`)
  }

  const search = container.resolve(Modules.SEARCH) as {
    reindex: (input?: Record<string, unknown>) => Promise<unknown>
  }

  await search.reindex()
  logger.info("Rebuilt product search index")

  const { data: finalProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "title"],
  })
  const { data: finalRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  })
  const { data: finalApiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "title", "token", "type"],
  })

  logger.info("JSB SONS seed complete")
  logger.info(`Products: ${finalProducts.length}`)
  logger.info(`Region: ${finalRegions.map((item) => `${item.name} (${item.currency_code})`).join(", ")}`)
  logger.info(
    `Publishable key: ${finalApiKeys.find((key) => key.type === "publishable")?.token}`
  )
}
