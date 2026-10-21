import { cookies } from "next/headers"
import type { NextResponse } from "next/server"
import { secureCookies } from "./cookies"

export const CUSTOMER_COOKIE = "jsb_customer_token"
export const CUSTOMER_EMAIL_DOMAIN = "customer.jsbsons.local"

const backendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"

const publishableKey =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

export function normaliseMobile(value: string): string | null {
  const digits = value.replace(/\D/g, "")

  if (digits.length === 10) {
    return `91${digits}`
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return digits
  }

  return null
}

export function mobileToEmail(mobile: string): string {
  return `${mobile}@${CUSTOMER_EMAIL_DOMAIN}`
}

export function mobileToPhone(mobile: string): string {
  return `+${mobile}`
}

export function customerToken(): string | undefined {
  return cookies().get(CUSTOMER_COOKIE)?.value
}

export async function backendFetch(
  path: string,
  token?: string,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers)
  if (init?.body) {
    headers.set("content-type", "application/json")
  }
  if (token) {
    headers.set("authorization", `Bearer ${token}`)
  }
  if (publishableKey) {
    headers.set("x-publishable-api-key", publishableKey)
  }

  return fetch(`${backendUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  })
}

export async function readBackendJson<T>(response: Response): Promise<T> {
  const text = await response.text()
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(text.slice(0, 240) || "The studio returned an empty response.")
  }
}

export function setCustomerCookie(response: NextResponse, token: string) {
  response.cookies.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookies,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}
