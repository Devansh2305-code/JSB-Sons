import Link from "next/link"
import {
  BACKEND_URL,
  adminFetch,
  requireAdmin,
  type AdminInventoryItem,
  type AdminProduct,
} from "@/lib/admin-api"
import { imagePath } from "@/lib/format"

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const token = await requireAdmin()
  const q = searchParams.q?.trim() ?? ""

  const [productsData, inventoryData] = await Promise.all([
    adminFetch<{ products: AdminProduct[]; count: number }>(
      `/admin/products?limit=100${q ? `&q=${encodeURIComponent(q)}` : ""}`,
      token
    ),
    adminFetch<{ inventory_items: AdminInventoryItem[] }>(
      "/admin/inventory-items?limit=500&fields=id,sku,title,stocked_quantity,reserved_quantity,*location_levels",
      token
    ).catch(() => ({ inventory_items: [] })),
  ])

  const stockBySku = new Map<string, number>()
  for (const item of inventoryData.inventory_items ?? []) {
    if (!item.sku) continue
    const available = item.location_levels?.length
      ? item.location_levels.reduce(
          (sum, level) => sum + Number(level.available_quantity ?? 0),
          0
        )
      : Number(item.stocked_quantity ?? 0) - Number(item.reserved_quantity ?? 0)
    stockBySku.set(item.sku, available)
  }

  return (
    <>
      <header className="admin-topbar">
        <div>
          <span className="eyebrow">The wardrobe</span>
          <h1>Products</h1>
        </div>
        <div className="admin-topbar-actions">
          <span className="admin-count">
            {productsData.count ?? 0} products
          </span>
          <a
            href={`${BACKEND_URL}/app/products/create`}
            target="_blank"
            rel="noreferrer"
            className="button button-dark"
          >
            New product
          </a>
        </div>
      </header>

      <form className="admin-search" action="/admin/products">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search products by title or handle"
          aria-label="Search products"
        />
        <button type="submit" className="button">
          Search
        </button>
      </form>

      <p className="admin-callout">
        Editing a product, its variants, prices and media opens in the full
        Medusa admin. Studio status and stock are visible here.
      </p>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table admin-table-wide">
            <thead>
              <tr>
                <th>Piece</th>
                <th>Status</th>
                <th>Variants</th>
                <th>Stock</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {(productsData.products ?? []).map((product) => {
                const variants = product.variants ?? []
                const stock = variants.reduce(
                  (sum, variant) =>
                    sum + (variant.sku ? (stockBySku.get(variant.sku) ?? 0) : 0),
                  0
                )
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="admin-product-cell">
                        {product.thumbnail ? (
                          <img src={imagePath(product.thumbnail)} alt="" />
                        ) : (
                          <span />
                        )}
                        <div>
                          <strong>{product.title}</strong>
                          <small>/{product.handle}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-pill ${
                          product.status === "published"
                            ? "status-delivered"
                            : "status-pending"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td>{variants.length}</td>
                    <td className={stock <= 5 ? "admin-low-stock" : ""}>
                      {stock} units
                    </td>
                    <td>
                      <a
                        href={`${BACKEND_URL}/app/products/${product.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-row-link"
                      >
                        Edit →
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {!(productsData.products ?? []).length ? (
          <p className="admin-empty">No products match this search.</p>
        ) : null}
      </section>

      <p className="admin-callout">
        Looking for categories, collections or media?{" "}
        <a
          href={`${BACKEND_URL}/app/categories`}
          target="_blank"
          rel="noreferrer"
        >
          Open the full catalog in Medusa
        </a>
        . <Link href="/shop">View the storefront</Link>.
      </p>
    </>
  )
}
