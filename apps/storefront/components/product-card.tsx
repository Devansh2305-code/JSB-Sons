import Image from "next/image"
import Link from "next/link"
import { formatMoney } from "@/lib/format"
import type { StoreProduct } from "@/lib/types"
import { ArrowUpRightIcon } from "./icons"

export function ProductCard({
  product,
  index,
  priority = false,
}: {
  product: StoreProduct
  index: number
  priority?: boolean
}) {
  const category = product.categories?.[0]

  return (
    <article className="product-card">
      <Link href={`/product/${product.handle}`} className="product-card-link">
        <div className="product-card-media">
          <Image
            src={product.thumbnail ?? product.images[0]?.url ?? "/products/13065308.jpg"}
            alt={product.title}
            fill
            sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 25vw"
            priority={priority}
          />
          <span className="product-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          {product.metadata?.is_new ? (
            <span className="product-badge">New</span>
          ) : null}
          <span className="product-quick">
            View piece <ArrowUpRightIcon />
          </span>
        </div>
        <div className="product-card-copy">
          <div>
            <span className="product-category">
              {category?.name ?? "JSB Sons"}
            </span>
            <h3>{product.title}</h3>
            <p>{product.subtitle}</p>
          </div>
          <div className="product-card-meta">
            <span>{formatMoney(product.price)}</span>
            <span className={product.totalStock > 0 ? "in-stock" : "out-stock"}>
              {product.totalStock > 0
                ? product.totalStock < 8
                  ? "Low stock"
                  : "In stock"
                : "Waitlist"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
