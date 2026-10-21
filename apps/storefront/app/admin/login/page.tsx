"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      })
      const data = (await response.json()) as { message?: string }

      if (!response.ok) {
        setError(data.message ?? "The studio could not be opened.")
        return
      }

      router.replace("/admin")
      router.refresh()
    } catch {
      setError("The studio could not be reached. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-login">
      <div className="admin-login-visual">
        <Image
          src="/products/5872320.jpg"
          alt="JSB Sons studio"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 52vw"
        />
        <Link href="/" className="admin-login-brand">
          JSB <span>SONS</span>
        </Link>
        <p>
          The studio,
          <br />
          after hours.
        </p>
      </div>

      <div className="admin-login-form">
        <span className="eyebrow">Restricted access</span>
        <h1>Studio desk.</h1>
        <p>
          Orders, stock, customers and the daily running of the house. Admin
          access only.
        </p>

        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="admin-mobile">Admin mobile</label>
            <input
              id="admin-mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="username"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              placeholder="90000 00000"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <button
            type="submit"
            className="button button-dark"
            disabled={submitting}
          >
            {submitting ? "Opening…" : "Enter the studio"}
          </button>
        </form>

        <Link href="/" className="text-link">
          Return to the storefront
        </Link>
      </div>
    </main>
  )
}
