import type { Metadata } from "next"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { Reveal } from "@/components/reveal"
import { SortSelect } from "@/components/sort-select"
import { getCatalog, getCategories } from "@/lib/api"

export const metadata: Metadata = {
  title: "Shop the wardrobe",
  description:
    "Shop all JSB Sons pieces — uniforms, everyday essentials, formal tailoring, occasion wear and ethnic silhouettes.",
}

type ShopSearchParams = {
  category?: string
  q?: string
  sort?: string
}

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? ""
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: ShopSearchParams
}) {
  const [catalog, categories] = await Promise.all([getCatalog(), getCategories()])
  const activeCategory = first(searchParams.category)
  const query = first(searchParams.q)
  const sort = first(searchParams.sort) || "featured"
  const selectedCategory = categories.find(
    (category) => category.handle === activeCategory
  )

  let products = catalog
  if (activeCategory) {
    products = products.filter((product) =>
      product.categories?.some((category) => category.handle === activeCategory)
    )
  }

  if (query) {
    const needle = query.toLowerCase()
    products = products.filter((product) =>
      [
        product.title,
        product.subtitle,
        product.description,
        ...(product.categories ?? []).map((category) => category.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle)
    )
  }

  products = [...products].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price
    if (sort === "price-desc") return b.price - a.price
    if (sort === "name") return a.title.localeCompare(b.title)
    if (sort === "newest") {
      return (
        Number(Boolean(b.metadata?.is_new)) -
          Number(Boolean(a.metadata?.is_new)) || a.title.localeCompare(b.title)
      )
    }
    return a.title.localeCompare(b.title)
  })

  function categoryHref(handle?: string): string {
    const params = new URLSearchParams()
    if (handle) params.set("category", handle)
    if (query) params.set("q", query)
    if (sort !== "featured") params.set("sort", sort)
    return `/shop${params.size ? `?${params.toString()}` : ""}`
  }

  return (
    <>
      <section className="shop-hero">
        <div>
          <span className="eyebrow">
            {selectedCategory ? "The world of" : "The complete collection"}
          </span>
          <h1>
            {selectedCategory ? (
              selectedCategory.name
            ) : (
              <>
                The <em>wardrobe.</em>
              </>
            )}
          </h1>
        </div>
        <div className="shop-hero-side">
          <p>
            {selectedCategory?.description ??
              "Every piece, in one place. Considered clothing for campus mornings, working days, long dinners and everything in between."}
          </p>
          <span className="eyebrow no-rule">
            {products.length} {products.length === 1 ? "piece" : "pieces"} / INR
          </span>
        </div>
      </section>

      <div className="shop-toolbar">
        <nav className="filter-list" aria-label="Filter by category">
          <Link
            href={categoryHref()}
            className={!activeCategory ? "is-active" : ""}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={categoryHref(category.handle)}
              className={activeCategory === category.handle ? "is-active" : ""}
            >
              {category.name}
            </Link>
          ))}
        </nav>
        <div className="toolbar-meta">
          <span>
            {String(products.length).padStart(2, "0")}{" "}
            {query ? `for “${query}”` : "pieces"}
          </span>
          <SortSelect value={sort} />
        </div>
      </div>

      <section className="shop-section">
        {query ? (
          <div className="shop-search-note">
            <span>
              Showing results for <strong>“{query}”</strong>
            </span>
            <Link href={categoryHref(activeCategory || undefined)}>
              Clear search
            </Link>
          </div>
        ) : null}

        {products.length ? (
          <div className="product-grid product-grid--shop">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={(index % 4) * 60}>
                <ProductCard
                  product={product}
                  index={index}
                  priority={index < 4}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="eyebrow">Nothing here yet</span>
            <h2>Try another world.</h2>
            <p>
              We couldn&apos;t find a piece matching that search. Clear the
              filters or browse the full wardrobe.
            </p>
            <Link href="/shop" className="button">
              Shop all pieces
            </Link>
          </div>
        )}
      </section>
    </>
  )
}
