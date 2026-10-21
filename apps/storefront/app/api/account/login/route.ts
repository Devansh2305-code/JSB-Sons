import { NextResponse } from "next/server"
import {
  backendFetch,
  mobileToEmail,
  normaliseMobile,
  readBackendJson,
  setCustomerCookie,
} from "@/lib/customer-auth-server"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const mobile = normaliseMobile(String(body.mobile ?? ""))
  const password = String(body.password ?? "")

  if (!mobile || password.length < 6) {
    return NextResponse.json(
      { message: "Enter a valid mobile number and password." },
      { status: 400 }
    )
  }

  const authResponse = await backendFetch("/auth/customer/emailpass", undefined, {
    method: "POST",
    body: JSON.stringify({ email: mobileToEmail(mobile), password }),
  })

  if (!authResponse.ok) {
    return NextResponse.json(
      { message: "That mobile number or password is not correct." },
      { status: 401 }
    )
  }

  const { token } = await readBackendJson<{ token: string }>(authResponse)
  const meResponse = await backendFetch("/store/customers/me", token)

  if (!meResponse.ok) {
    return NextResponse.json(
      { message: "This login is not linked to a customer profile yet." },
      { status: 409 }
    )
  }

  const { customer } = await readBackendJson<{ customer: unknown }>(meResponse)
  const response = NextResponse.json({ customer })
  setCustomerCookie(response, token)

  return response
}
