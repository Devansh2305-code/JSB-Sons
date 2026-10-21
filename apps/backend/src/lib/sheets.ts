import type { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type SheetOrder = {
  id: string
  display_id: number
  created_at: string
  email?: string | null
  currency_code: string
  total: number
  status?: string | null
  payment_status?: string | null
  metadata?: { jsb_status?: string } | null
  customer?: {
    first_name?: string | null
    last_name?: string | null
    phone?: string | null
    metadata?: { mobile?: string | null } | null
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
    title?: string | null
    product_title?: string | null
    variant_title?: string | null
    quantity?: number | null
    total?: number | null
  }[]
}

export function sheetSyncEnabled(): boolean {
  return Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL)
}

export async function syncOrderToSheet(
  container: MedusaContainer,
  orderId: string
): Promise<void> {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL

  if (!url) {
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "created_at",
      "email",
      "currency_code",
      "total",
      "status",
      "payment_status",
      "metadata",
      "customer.first_name",
      "customer.last_name",
      "customer.phone",
      "customer.metadata",
      "shipping_address.first_name",
      "shipping_address.last_name",
      "shipping_address.address_1",
      "shipping_address.address_2",
      "shipping_address.city",
      "shipping_address.province",
      "shipping_address.postal_code",
      "shipping_address.country_code",
      "shipping_address.phone",
      "items.title",
      "items.product_title",
      "items.variant_title",
      "items.quantity",
      "items.total",
    ],
    filters: { id: orderId },
  })

  const order = orders[0] as unknown as SheetOrder | undefined

  if (!order) {
    return
  }

  const address = order.shipping_address
  const customer = order.customer
  const customerName =
    [address?.first_name, address?.last_name].filter(Boolean).join(" ") ||
    [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") ||
    order.email ||
    "Guest"

  const items = (order.items ?? [])
    .map((item) => {
      const name = item.product_title ?? item.title ?? "Item"
      const variant = item.variant_title ? ` (${item.variant_title})` : ""

      return `${name}${variant} x${item.quantity ?? 1}`
    })
    .join("; ")

  const addressText = [
    [address?.address_1, address?.address_2].filter(Boolean).join(", "),
    [address?.city, address?.province].filter(Boolean).join(", "),
    [address?.postal_code, address?.country_code?.toUpperCase()]
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join(", ")

  const payload = {
    token: process.env.GOOGLE_SHEETS_TOKEN ?? "",
    order_id: order.id,
    display_id: order.display_id,
    created_at: order.created_at,
    customer_name: customerName,
    mobile: customer?.metadata?.mobile ?? customer?.phone ?? address?.phone ?? "",
    email: order.email ?? "",
    items,
    item_count: (order.items ?? []).reduce(
      (sum, item) => sum + Number(item.quantity ?? 0),
      0
    ),
    total: order.total,
    currency_code: order.currency_code,
    payment_status: order.payment_status ?? "",
    status: order.metadata?.jsb_status ?? order.status ?? "",
    address: addressText,
    updated_at: new Date().toISOString(),
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      logger.warn(
        `Google Sheets sync failed for order ${order.display_id}: webhook responded with ${response.status}`
      )
    }
  } catch (error) {
    logger.warn(
      `Google Sheets sync failed for order ${order.display_id}: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}
