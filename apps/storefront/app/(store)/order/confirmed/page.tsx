"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CheckIcon } from "@/components/icons"
import { formatMoney } from "@/lib/format"

type ConfirmedOrder = {
  id: string
  display_id: number
  total: number
  email?: string
  items?: {
    id: string
    title: string
    product_title?: string
    variant_title?: string
    quantity: number
    total: number
  }[]
}

export default function OrderConfirmedPage() {
  const [order, setOrder] = useState<ConfirmedOrder | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const raw = window.sessionStorage.getItem("jsb_last_order")
    if (raw) {
      try {
        setOrder(JSON.parse(raw) as ConfirmedOrder)
      } catch {
        setOrder(null)
      }
    }
    setChecked(true)
  }, [])

  if (!checked) {
    return <section className="confirmation-page" />
  }

  if (!order) {
    return (
      <section className="confirmation-page">
        <span className="eyebrow">Order confirmation</span>
        <h1>
          The record is <em>quiet.</em>
        </h1>
        <p>
          We couldn&apos;t find a recent order in this browser. Sign in to see
          your order history, or return to the wardrobe.
        </p>
        <div className="confirmation-actions">
          <Link href="/account" className="button button-dark">
            View your account
          </Link>
          <Link href="/shop" className="button">
            Keep shopping
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="confirmation-page">
      <div className="confirmation-mark">
        <CheckIcon />
      </div>
      <span className="eyebrow" style={{ marginTop: 26 }}>
        Order #{order.display_id} received
      </span>
      <h1>
        Consider it <em>yours.</em>
      </h1>
      <p>
        Thank you. Your order is now with the studio. We&apos;ll send a
        confirmation to {order.email ?? "your email"} and dispatch it from
        Gurugram within 24–48 hours.
      </p>

      <div className="confirmation-card">
        <div className="confirmation-card-head">
          <span>Order summary</span>
          <span>{order.id}</span>
        </div>
        <div className="confirmation-items">
          {(order.items ?? []).map((item) => (
            <div key={item.id}>
              <span>
                {item.product_title ?? item.title}
                {item.variant_title ? ` · ${item.variant_title}` : ""} ×{" "}
                {item.quantity}
              </span>
              <span>{formatMoney(item.total)}</span>
            </div>
          ))}
        </div>
        <div className="confirmation-total">
          <span>Total incl. GST</span>
          <strong>{formatMoney(order.total)}</strong>
        </div>
      </div>

      <div className="confirmation-actions">
        <Link href="/shop" className="button button-dark">
          Continue shopping
        </Link>
        <Link href="/account" className="button">
          View account
        </Link>
      </div>
    </section>
  )
}
