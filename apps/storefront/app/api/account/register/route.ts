import { NextResponse } from "next/server"
import {
  backendFetch,
  mobileToEmail,
  mobileToPhone,
  normaliseMobile,
  readBackendJson,
  setCustomerCookie,
} from "@/lib/customer-auth-server"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const mobile = normaliseMobile(String(body.mobile ?? ""))
  const password = String(body.password ?? "")
  const firstName = String(body.first_name ?? "").trim()
  const lastName = String(body.last_name ?? "").trim()

  if (!mobile || password.length < 6) {
    return NextResponse.json(
      {
        message:
          "Enter a valid mobile number and a password of at least 6 characters.",
      },
      { status: 400 }
    )
  }

  const registerResponse = await backendFetch(
    "/auth/customer/emailpass/register",
    undefined,
    {
      method: "POST",
      body: JSON.stringify({ email: mobileToEmail(mobile), password }),
    }
  )

  if (!registerResponse.ok) {
    const status = registerResponse.status === 409 ? 409 : 400
    return NextResponse.json(
      {
        message:
          status === 409
            ? "An account already exists for this mobile number."
            : "We could not create this account.",
      },
      { status }
    )
  }

  const { token } = await readBackendJson<{ token: string }>(registerResponse)
  const customerResponse = await backendFetch("/store/customers", token, {
    method: "POST",
    body: JSON.stringify({
      email: mobileToEmail(mobile),
      phone: mobileToPhone(mobile),
      first_name: firstName || undefined,
      last_name: lastName || undefined,
      metadata: { mobile },
    }),
  })

  if (!customerResponse.ok) {
    return NextResponse.json(
      { message: "The account was started but the profile could not be saved." },
      { status: 400 }
    )
  }

  const { customer } = await readBackendJson<{ customer: unknown }>(
    customerResponse
  )

  const loginResponse = await backendFetch(
    "/auth/customer/emailpass",
    undefined,
    {
      method: "POST",
      body: JSON.stringify({ email: mobileToEmail(mobile), password }),
    }
  )

  if (!loginResponse.ok) {
    return NextResponse.json(
      { message: "Account created. Please sign in to continue." },
      { status: 201 }
    )
  }

  const { token: sessionToken } = await readBackendJson<{ token: string }>(
    loginResponse
  )
  const response = NextResponse.json({ customer })
  setCustomerCookie(response, sessionToken)

  return response
}
