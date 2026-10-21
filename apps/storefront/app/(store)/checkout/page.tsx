"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, type FormEvent } from "react"
import { useCart } from "@/components/cart-provider"
import { clientStoreFetch } from "@/lib/client-api"
import { formatMoney, imagePath } from "@/lib/format"
import type { Cart, ShippingOption } from "@/lib/types"

type Address = {
  first_name: string
  last_name: string
  address_1: string
  address_2: string
  city: string
  province: string
  postal_code: string
  country_code: string
  phone: string
}

const emptyAddress: Address = {
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  province: "",
  postal_code: "",
  country_code: "in",
  phone: "",
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clear } = useCart()
  const [address, setAddress] = useState<Address>(emptyAddress)
  const [email, setEmail] = useState("")
  const [options, setOptions] = useState<ShippingOption[]>([])
  const [optionId, setOptionId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [optionsLoading, setOptionsLoading] = useState(true)

  const items = cart?.items ?? []
  const selectedOption = options.find((option) => option.id === optionId)
  const shippingAmount =
    selectedOption?.calculated_price?.calculated_amount ?? selectedOption?.amount ?? 0
  const hasShipping = Boolean(cart?.shipping_methods?.length)
  const total = (cart?.total ?? 0) + (hasShipping ? 0 : shippingAmount)

  useEffect(() => {
    if (!cart?.id) {
      return
    }

    let active = true
    setOptionsLoading(true)
    clientStoreFetch<{ shipping_options: ShippingOption[] }>(
      `/store/shipping-options?cart_id=${cart.id}`
    )
      .then((data) => {
        if (!active) return
        setOptions(data.shipping_options ?? [])
        setOptionId((current) => current || data.shipping_options?.[0]?.id || "")
      })
      .catch(() => {
        if (active) setError("Shipping options could not be loaded.")
      })
      .finally(() => {
        if (active) setOptionsLoading(false)
      })

    return () => {
      active = false
    }
  }, [cart?.id])

  function setField(field: keyof Address, value: string) {
    setAddress((current) => ({ ...current, [field]: value }))
  }

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!cart?.id && !items.length) {
      setError("Your bag is empty.")
      return
    }

    if (!cart?.id) {
      return
    }

    const required = [
      email,
      address.first_name,
      address.last_name,
      address.address_1,
      address.city,
      address.province,
      address.postal_code,
      address.phone,
    ]

    if (required.some((value) => !value.trim())) {
      setError("Please complete every required field.")
      return
    }

    if (!optionId) {
      setError("Please choose a delivery method.")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      await clientStoreFetch<{ cart: Cart }>(`/store/carts/${cart.id}`, {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          shipping_address: address,
          billing_address: address,
        }),
      })

      if (!hasShipping) {
        await clientStoreFetch(`/store/carts/${cart.id}/shipping-methods`, {
          method: "POST",
          body: JSON.stringify({ option_id: optionId }),
        })
      }

      let collectionId = cart.payment_collection?.id
      let paymentCollection: {
        id: string
        payment_sessions?: { id: string; provider_id: string }[]
      } | null = null

      if (!collectionId) {
        const collection = await clientStoreFetch<{
          payment_collection: {
            id: string
            payment_sessions?: { id: string; provider_id: string }[]
          }
        }>("/store/payment-collections", {
          method: "POST",
          body: JSON.stringify({ cart_id: cart.id }),
        })
        collectionId = collection.payment_collection.id
        paymentCollection = collection.payment_collection
      }

      if (
        collectionId &&
        !paymentCollection?.payment_sessions?.some(
          (session) => session.provider_id === "pp_system_default"
        )
      ) {
        await clientStoreFetch(
          `/store/payment-collections/${collectionId}/payment-sessions`,
          {
            method: "POST",
            body: JSON.stringify({ provider_id: "pp_system_default" }),
          }
        )
      }

      const result = await clientStoreFetch<{
        type: "order" | "cart"
        order?: {
          id: string
          display_id: number
          total: number
          email?: string
          items?: {
            id: string
            product_title?: string
            title: string
            variant_title?: string
            quantity: number
            total: number
          }[]
        }
        cart?: Cart
        error?: { message?: string }
      }>(`/store/carts/${cart.id}/complete`, {
        method: "POST",
        body: JSON.stringify({}),
      })

      if (result.type !== "order" || !result.order) {
        throw new Error(result.error?.message ?? "The order could not be placed.")
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("jsb_last_order", JSON.stringify(result.order))
      }

      clear()
      router.push("/order/confirmed")
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "The order could not be placed. Please try again."
      )
      setSubmitting(false)
    }
  }

  if (!cart || !items.length) {
    return (
      <section className="form-page">
        <div className="empty-state">
          <span className="eyebrow">Checkout</span>
          <h2>Your bag is quiet.</h2>
          <p>Add a piece before checking out. The wardrobe is waiting.</p>
          <Link href="/shop" className="button button-dark">
            Shop the collection
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="form-page">
      <header className="form-page-head">
        <span className="eyebrow">Secure checkout</span>
        <h1>
          Make it <em style={{ color: "var(--vermillion)", fontWeight: 400 }}>yours.</em>
        </h1>
        <p>
          Delivery details, then a final look. Every order is packed in
          Gurugram and comes with a GST invoice.
        </p>
      </header>

      <div className="checkout-layout">
        <form className="checkout-main checkout-form" onSubmit={placeOrder}>
          <section className="checkout-step">
            <div className="step-title">
              <h2>Contact</h2>
              <span>01</span>
            </div>
            <div className="form-grid">
              <div className="field field-full">
                <label htmlFor="checkout-email">Email address *</label>
                <input
                  id="checkout-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
          </section>

          <section className="checkout-step">
            <div className="step-title">
              <h2>Delivery</h2>
              <span>02</span>
            </div>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="first-name">First name *</label>
                <input
                  id="first-name"
                  autoComplete="given-name"
                  value={address.first_name}
                  onChange={(event) => setField("first_name", event.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="last-name">Last name *</label>
                <input
                  id="last-name"
                  autoComplete="family-name"
                  value={address.last_name}
                  onChange={(event) => setField("last_name", event.target.value)}
                  required
                />
              </div>
              <div className="field field-full">
                <label htmlFor="address-1">Address *</label>
                <input
                  id="address-1"
                  autoComplete="address-line1"
                  value={address.address_1}
                  onChange={(event) => setField("address_1", event.target.value)}
                  placeholder="Flat, house no., street"
                  required
                />
              </div>
              <div className="field field-full">
                <label htmlFor="address-2">Apartment, landmark (optional)</label>
                <input
                  id="address-2"
                  autoComplete="address-line2"
                  value={address.address_2}
                  onChange={(event) => setField("address_2", event.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  autoComplete="address-level2"
                  value={address.city}
                  onChange={(event) => setField("city", event.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="province">State *</label>
                <input
                  id="province"
                  autoComplete="address-level1"
                  value={address.province}
                  onChange={(event) => setField("province", event.target.value)}
                  placeholder="Maharashtra"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="postal-code">PIN code *</label>
                <input
                  id="postal-code"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  value={address.postal_code}
                  onChange={(event) => setField("postal_code", event.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Mobile number *</label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={address.phone}
                  onChange={(event) => setField("phone", event.target.value)}
                  placeholder="+91 90000 00000"
                  required
                />
              </div>
            </div>
          </section>

          <section className="checkout-step">
            <div className="step-title">
              <h2>Delivery method</h2>
              <span>03</span>
            </div>
            {optionsLoading ? (
              <p className="muted">Loading delivery options…</p>
            ) : (
              <div className="shipping-options">
                {options.map((option) => {
                  const amount =
                    option.calculated_price?.calculated_amount ?? option.amount ?? 0
                  return (
                    <label
                      key={option.id}
                      className={`shipping-option ${
                        optionId === option.id ? "is-active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={optionId === option.id}
                        onChange={() => setOptionId(option.id)}
                      />
                      <span className="shipping-option-copy">
                        <span>
                          <strong>{option.name}</strong>
                          <small>
                            {option.name.toLowerCase().includes("express")
                              ? "Priority dispatch, 1–2 working days"
                              : "Dispatched in 24–48 hours, 3–5 working days"}
                          </small>
                        </span>
                        <span>{formatMoney(amount)}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </section>

          <section className="checkout-step">
            <div className="step-title">
              <h2>Payment</h2>
              <span>04</span>
            </div>
            <div className="payment-note">
              <strong>Payment on delivery.</strong> This studio build records your
              order now and confirms payment separately. A live payment gateway
              can be connected before launch.
            </div>
          </section>

          {error ? (
            <div className="checkout-error">
              <span className="form-error">{error}</span>
            </div>
          ) : null}

          <button
            type="submit"
            className="button button-dark"
            disabled={submitting || optionsLoading}
          >
            {submitting ? "Placing your order…" : "Place order"}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Your order</h2>
          <div className="checkout-summary-items">
            {items.map((item) => (
              <div key={item.id} className="checkout-summary-item">
                <div className="checkout-summary-item-image">
                  <Image
                    src={imagePath(item.thumbnail)}
                    alt={item.title}
                    fill
                    sizes="52px"
                  />
                </div>
                <div>
                  <h3>{item.product_title ?? item.title}</h3>
                  <p>
                    {item.variant_title} · Qty {item.quantity}
                  </p>
                </div>
                <span>{formatMoney(item.total)}</span>
              </div>
            ))}
          </div>

          <div className="summary-lines">
            <div>
              <span>Items</span>
              <span>{formatMoney(cart.item_subtotal)}</span>
            </div>
            <div>
              <span>GST (5%)</span>
              <span>{formatMoney(cart.tax_total)}</span>
            </div>
            <div>
              <span>Delivery</span>
              <span>
                {hasShipping
                  ? formatMoney(cart.shipping_total)
                  : shippingAmount
                    ? formatMoney(shippingAmount)
                    : "Select"}
              </span>
            </div>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatMoney(total)}</strong>
          </div>
          <p className="summary-note">
            Prices are inclusive of GST. Your order is not charged until payment
            is confirmed.
          </p>
        </aside>
      </div>
    </section>
  )
}
