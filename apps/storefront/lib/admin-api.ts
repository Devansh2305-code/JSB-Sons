import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const ADMIN_COOKIE = "jsb_admin_token"
export const ADMIN_EMAIL = process.env.JSB_ADMIN_EMAIL ?? "admin@jsbsons.local"
export const ADMIN_MOBILE = (process.env.JSB_ADMIN_MOBILE ?? "9000000001").replace(
  /\D/g,
  ""
)

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"

export function normaliseAdminMobile(value: string): string {
  return value.replace(/\D/g, "")
}

export function adminToken(): string | undefined {
  return cookies().get(ADMIN_COOKIE)?.value
}

export async function adminFetch<T>(
  path: string,
  token: string,
  init?: RequestInit
): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set("authorization", `Bearer ${token}`)
  if (init?.body) {
    headers.set("content-type", "application/json")
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Admin API ${response.status}: ${message.slice(0, 260)}`)
  }

  return response.json() as Promise<T>
}

export async function requireAdmin(): Promise<string> {
  const token = adminToken()

  if (!token) {
    redirect("/admin/login")
  }

  const response = await fetch(`${BACKEND_URL}/admin/users/me`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  })

  if (!response.ok) {
    redirect("/admin/login")
  }

  return token
}

export const ADMIN_ORDER_FIELDS = [
  "id",
  "display_id",
  "email",
  "currency_code",
  "status",
  "total",
  "created_at",
  "metadata",
  "payment_status",
  "fulfillment_status",
  "*customer",
].join(",")

export const ADMIN_ORDER_DETAIL_FIELDS = [
  ADMIN_ORDER_FIELDS,
  "subtotal",
  "shipping_total",
  "tax_total",
  "discount_total",
  "*items",
  "*shipping_methods",
  "*shipping_address",
  "*billing_address",
].join(",")

export type AdminNotification = {
  id: string
  type: string
  title: string
  message: string
  order_id?: string | null
  order_display_id?: number | null
  customer_name?: string | null
  amount?: number | null
  currency_code?: string | null
  is_read: boolean
  created_at: string
}

export type AdminOrder = {
  id: string
  display_id: number
  email?: string | null
  currency_code: string
  status: string
  total: number
  created_at: string
  metadata?: { jsb_status?: string } | null
  customer?: {
    first_name?: string | null
    last_name?: string | null
    email?: string | null
  } | null
  shipping_address?: {
    first_name?: string | null
    last_name?: string | null
    address_1?: string | null
    address_2?: string | null
    city?: string | null
    province?: string | null
    postal_code?: string | null
    country_code?: string | null
    phone?: string | null
  } | null
  items?: {
    id: string
    title: string
    product_title?: string
    variant_title?: string | null
    quantity: number
    total: number
    thumbnail?: string | null
  }[]
  payment_status?: string
  fulfillment_status?: string
}

export type AdminProduct = {
  id: string
  title: string
  handle: string
  status: string
  thumbnail?: string | null
  created_at: string
  variants?: { id: string; sku?: string | null; title: string }[]
}

export type AdminCustomer = {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  created_at: string
  metadata?: { mobile?: string } | null
}

export type AdminInventoryItem = {
  id: string
  sku?: string | null
  title?: string | null
  stocked_quantity: number
  reserved_quantity: number
  location_levels?: { available_quantity: number }[]
}

export async function getNotifications(
  token: string
): Promise<{ notifications: AdminNotification[]; unread_count: number }> {
  return adminFetch("/admin/jsb-notifications", token)
}

export function orderStatus(order: AdminOrder): string {
  return order.metadata?.jsb_status ?? order.status
}
