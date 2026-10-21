"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { MinusIcon, PlusIcon } from "@/components/icons"
import { formatMoney, imagePath } from "@/lib/format"

export default function CartPage() {
  const { cart, updateItem, removeItem, loading } = useCart()
  const items = cart?.items ?? []
  const shippingEstimate =
    cart?.shipping_total && cart.shipping_total > 0 ? cart.shipping_total : 99
  const estimatedTotal =
    (cart?.total ?? 0) +
    (cart?.shipping_methods?.length ? 0 : shippingEstimate)

  return (
    <section className="cart-page">
      <header className="cart-header">
        <div>
          <span className="eyebrow">Your selection</span>
          <h1>The bag.</h1>
        </div>
        <p>
          {items.length
            ? `${items.length} ${items.length === 1 ? "piece" : "pieces"} reserved for you`
            : "Nothing reserved yet"}
        </p>
      </header>

      {!items.length ? (
        <div className="cart-empty">
          <span className="eyebrow">Your bag is empty</span>
          <h1>Start with a piece.</h1>
          <p>
            Build a wardrobe one considered decision at a time. The new edit is
            ready when you are.
          </p>
          <Link href="/shop" className="button button-dark">
            Shop the wardrobe
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article key={item.id} className="cart-item">
                <Link
                  href={`/product/${item.product_handle}`}
                  className="cart-item-image"
                >
                  <Image
                    src={imagePath(item.thumbnail)}
                    alt={item.title}
                    fill
                    sizes="120px"
                  />
                </Link>

                <div className="cart-item-copy">
                  <div>
                    <Link href={`/product/${item.product_handle}`}>
                      <h2>{item.product_title ?? item.title}</h2>
                    </Link>
                    <p>{item.variant_title ?? item.subtitle}</p>
                  </div>
                </div>

                <div className="cart-item-price">
                  <span>{formatMoney(item.total)}</span>
                  <small>
                    {formatMoney(item.unit_price)} each
                  </small>
                </div>

                <div className="cart-item-controls">
                  <div className="quantity-stepper quantity-stepper--small">
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                      disabled={loading}
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      disabled={loading}
                      aria-label="Increase quantity"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="remove-link"
                    onClick={() => removeItem(item.id)}
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order summary</h2>
            <div className="summary-lines">
              <div>
                <span>Items</span>
                <span>{formatMoney(cart?.item_subtotal)}</span>
              </div>
              <div>
                <span>GST (5%)</span>
                <span>{formatMoney(cart?.tax_total)}</span>
              </div>
              <div>
                <span>Shipping (est.)</span>
                <span>{formatMoney(shippingEstimate)}</span>
              </div>
            </div>
            <div className="summary-total">
              <span>Total (est.)</span>
              <strong>{formatMoney(estimatedTotal)}</strong>
            </div>
            <Link href="/checkout" className="button button-dark">
              Proceed to checkout
            </Link>
            <p className="summary-note">
              Secure local checkout. Shipping and taxes are confirmed at the next
              step. Every order includes a GST invoice.
            </p>
          </aside>
        </div>
      )}
    </section>
  )
}
