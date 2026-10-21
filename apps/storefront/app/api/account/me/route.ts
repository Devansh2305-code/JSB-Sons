import { NextResponse } from "next/server"
import {
  backendFetch,
  customerToken,
  readBackendJson,
} from "@/lib/customer-auth-server"

export async function GET() {
  const token = customerToken()

  if (!token) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 })
  }

  const response = await backendFetch("/store/customers/me", token)

  if (!response.ok) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 })
  }

  const { customer } = await readBackendJson<{ customer: unknown }>(response)
  return NextResponse.json({ customer })
}
