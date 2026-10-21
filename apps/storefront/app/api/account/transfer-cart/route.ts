import { NextResponse } from "next/server"
import {
  backendFetch,
  customerToken,
  readBackendJson,
} from "@/lib/customer-auth-server"

export async function POST(request: Request) {
  const token = customerToken()

  if (!token) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const cartId = String(body.cart_id ?? "")

  if (!cartId) {
    return NextResponse.json({ message: "Cart is required." }, { status: 400 })
  }

  const response = await backendFetch(`/store/carts/${cartId}/customer`, token, {
    method: "POST",
    body: JSON.stringify({}),
  })

  if (!response.ok) {
    return NextResponse.json(
      { message: "The bag could not be linked to your account." },
      { status: response.status }
    )
  }

  const data = await readBackendJson<{ cart: unknown }>(response)
  return NextResponse.json(data)
}
