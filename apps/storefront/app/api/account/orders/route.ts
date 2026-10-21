import { NextResponse } from "next/server"
import {
  backendFetch,
  customerToken,
  readBackendJson,
} from "@/lib/customer-auth-server"

const ORDER_FIELDS = [
  "id",
  "display_id",
  "created_at",
  "updated_at",
  "status",
  "total",
  "currency_code",
  "metadata",
  "items.id",
  "items.title",
  "items.product_title",
  "items.variant_title",
  "items.thumbnail",
  "items.quantity",
  "items.total",
].join(",")

export async function GET() {
  const token = customerToken()

  if (!token) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 })
  }

  const response = await backendFetch(
    `/store/orders?fields=${encodeURIComponent(ORDER_FIELDS)}&limit=50`,
    token
  )

  if (!response.ok) {
    return NextResponse.json(
      { message: "Orders could not be loaded." },
      { status: response.status }
    )
  }

  const data = await readBackendJson<{
    orders: (Record<string, unknown> & {
      status?: string
      metadata?: Record<string, unknown> | null
    })[]
    count: number
  }>(response)

  return NextResponse.json({
    ...data,
    orders: data.orders.map((order) => ({
      ...order,
      status:
        (order.metadata?.jsb_status as string | undefined) ??
        order.status ??
        "pending",
    })),
  })
}
