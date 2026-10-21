"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState, type FormEvent } from "react"
import { formatDate, formatMoney } from "@/lib/format"
import type { Customer } from "@/lib/types"

type AccountOrder = {
  id: string
  display_id: number
  created_at: string
  status: string
  total: number
  currency_code: string
  metadata?: { jsb_status?: string } | null
}

type Mode = "login" | "register"

export default function AccountPage() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<AccountOrder[]>([])
  const [checking, setChecking] = useState(true)
  const [mode, setMode] = useState<Mode>("login")
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const loadOrders = useCallback(async () => {
    const response = await fetch("/api/account/orders", { cache: "no-store" })
    if (!response.ok) {
      setOrders([])
      return
    }
    const data = (await response.json()) as { orders: AccountOrder[] }
    setOrders(data.orders ?? [])
  }, [])

  useEffect(() => {
    let active = true
    fetch("/api/account/me", { cache: "no-store" })
      .then(async (response) => {
        if (!active) return
        if (!response.ok) {
          setChecking(false)
          return
        }
        const data = (await response.json()) as { customer: Customer }
        setCustomer(data.customer)
        await loadOrders()
        if (active) setChecking(false)
      })
      .catch(() => {
        if (active) setChecking(false)
      })

    return () => {
      active = false
    }
  }, [loadOrders])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const response = await fetch(`/api/account/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mobile,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      })
      const data = (await response.json()) as {
        customer?: Customer
        message?: string
      }

      if (!response.ok || !data.customer) {
        setError(data.message ?? "That did not work. Please try again.")
        return
      }

      setCustomer(data.customer)
      setPassword("")

      const cartId = window.localStorage.getItem("jsb_sons_cart_id")
      if (cartId) {
        await fetch("/api/account/transfer-cart", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ cart_id: cartId }),
        }).catch(() => undefined)
        window.dispatchEvent(new Event("jsb:cart-updated"))
      }

      await loadOrders()
    } catch {
      setError("The studio could not be reached. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  async function logout() {
    await fetch("/api/account/logout", { method: "POST" })
    setCustomer(null)
    setOrders([])
    setMobile("")
    setPassword("")
  }

  if (checking) {
    return (
      <section className="form-page">
        <div className="empty-state">
          <span className="eyebrow">Your account</span>
          <h2>Opening the studio…</h2>
        </div>
      </section>
    )
  }

  if (!customer) {
    return (
      <section className="account-page">
        <div className="account-visual">
          <Image
            src="/products/13065308.jpg"
            alt="JSB Sons tailoring"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <p className="account-visual-copy">
            Your wardrobe,
            <br />
            kept close.
          </p>
        </div>

        <div className="account-form-wrap">
          <span className="eyebrow">The private list</span>
          <h1>{mode === "login" ? "Welcome back." : "Join the house."}</h1>
          <p>
            {mode === "login"
              ? "Sign in with your mobile number to see orders, keep your bag and move through checkout faster."
              : "One mobile number, one password. Your orders and details stay together, ready for the next piece."}
          </p>

          <form className="account-form" onSubmit={submit}>
            {mode === "register" ? (
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="account-first">First name</label>
                  <input
                    id="account-first"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    autoComplete="given-name"
                  />
                </div>
                <div className="field">
                  <label htmlFor="account-last">Last name</label>
                  <input
                    id="account-last"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    autoComplete="family-name"
                  />
                </div>
              </div>
            ) : null}

            <div className="field">
              <label htmlFor="account-mobile">Mobile number</label>
              <input
                id="account-mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
                placeholder="90000 00000"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="account-password">Password</label>
              <input
                id="account-password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </div>

            {error ? <p className="form-error">{error}</p> : null}

            <button
              type="submit"
              className="button button-dark"
              disabled={submitting}
            >
              {submitting
                ? "One moment…"
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <div className="account-switch">
            <span>
              {mode === "login" ? "New to JSB Sons?" : "Already have an account?"}
            </span>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login")
                setError("")
              }}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </div>
        </div>
      </section>
    )
  }

  const displayMobile =
    (customer.metadata?.mobile as string | undefined) ??
    customer.phone ??
    "Member"

  return (
    <section className="account-dashboard">
      <header className="account-dashboard-head">
        <div>
          <span className="eyebrow">Your account</span>
          <h1>
            Hello
            {customer.first_name ? `, ${customer.first_name}` : "."}
          </h1>
        </div>
        <span>{displayMobile}</span>
      </header>

      <div className="account-grid">
        <aside className="account-side">
          <h2>The house list</h2>
          <p>
            Your orders live here, from first look to final stitch. Need a hand
            with a piece? The studio is a message away.
          </p>
          <span className="eyebrow no-rule">{orders.length} orders</span>
          <button type="button" className="button" onClick={logout}>
            Sign out
          </button>
          <Link href="/shop" className="text-link">
            Back to the wardrobe
          </Link>
        </aside>

        <div>
          {orders.length ? (
            <div className="order-list">
              {orders.map((order) => {
                const status = order.metadata?.jsb_status ?? order.status
                return (
                  <div key={order.id} className="order-row">
                    <strong>#{order.display_id}</strong>
                    <span>{formatDate(order.created_at)}</span>
                    <span className="order-status">{status}</span>
                    <span>{formatMoney(order.total, order.currency_code)}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="empty-state">
              <span className="eyebrow">No orders yet</span>
              <h2>The first piece awaits.</h2>
              <p>
                When you order, it will appear here with its progress from the
                studio to your door.
              </p>
              <Link href="/shop" className="button button-dark">
                Explore the collection
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
