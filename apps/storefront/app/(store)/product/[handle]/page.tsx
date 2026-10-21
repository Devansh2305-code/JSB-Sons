import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { ProductGallery } from "@/components/product-gallery"
import { ProductPurchase } from "@/components/product-purchase"
import { Reveal } from "@/components/reveal"
import { getCatalog, getProduct } from "@/lib/api"

export async function generateMetadata({
  params,
}: {
  params: { handle: string }
}): Promise<Metadata> {
  const product = await getProduct(params.handle)

  if (!product) {
    return { title: "Piece not found" }
  }

  return {
    title: product.title,
    description:
      product.description ??
      `${product.title} by JSB Sons. Made in India, finished in Gurugram.`,
  }
}

export default async function ProductPage({
  params,
}: {
  params: { handle: string }
}) {
  const product = await getProduct(params.handle)

  if (!product) {
    notFound()
  }

  const catalog = await getCatalog()
  const category = product.categories?.[0]
  const related = catalog
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        candidate.categories?.some((item) => item.handle === category?.handle)
    )
    .slice(0, 4)
  const fallbackRelated = catalog
    .filter((candidate) => candidate.id !== product.id)
    .slice(0, 4)
  const relatedProducts = related.length >= 2 ? related : fallbackRelated

  return (
    <>
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        {category ? (
          <>
            <span>/</span>
            <Link href={`/shop?category=${category.handle}`}>
              {category.name}
            </Link>
          </>
        ) : null}
        <span>/</span>
        <span>{product.title}</span>
      </nav>

      <section className="product-layout">
        <ProductGallery images={product.images} title={product.title} />

        <div className="product-info">
          <span className="eyebrow">
            {category?.name ?? "JSB Sons"} / {product.collection?.title ?? "The collection"}
          </span>
          <h1 className="product-title">{product.title}</h1>
          {product.subtitle ? (
            <p className="product-subtitle">{product.subtitle}</p>
          ) : null}
          <p className="product-description">{product.description}</p>

          <ProductPurchase product={product} />
        </div>
      </section>

      <div className="product-details-band">
        <div className="product-details">
          <div className="product-detail">
            <span>Cloth</span>
            <p>{product.metadata?.fabric ?? "Considered natural fibres"}</p>
            <small>
              {product.metadata?.origin ??
                "Made in India, finished in our Gurugram atelier."}
            </small>
          </div>
          <div className="product-detail">
            <span>Cut</span>
            <p>{product.metadata?.fit ?? "Relaxed, true to size"}</p>
            <small>
              Model notes and measurements are available on request. Our team is
              happy to help you find the right fit.
            </small>
          </div>
          <div className="product-detail">
            <span>Care</span>
            <p>{product.metadata?.care ?? "Gentle care, long life"}</p>
            <small>
              {product.metadata?.delivery ??
                "Dispatched within 24–48 hours. Free shipping over ₹4,999."}
            </small>
          </div>
        </div>
      </div>

      <section className="related-section">
        <div className="section-head">
          <span className="eyebrow">Continue the wardrobe</span>
          <h2>Wear it with.</h2>
          <Link href={`/shop?category=${category?.handle ?? ""}`} className="text-link">
            More from {category?.name ?? "the shop"}
          </Link>
        </div>
        <div className="product-grid product-grid--shop">
          {relatedProducts.map((candidate, index) => (
            <Reveal key={candidate.id} delay={index * 60}>
              <ProductCard product={candidate} index={index} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
