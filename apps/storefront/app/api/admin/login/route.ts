import { NextResponse } from "next/server"
import {
  ADMIN_COOKIE,
  ADMIN_EMAIL,
  ADMIN_MOBILE,
  normaliseAdminMobile,
} from "@/lib/admin-api"
import { secureCookies } from "@/lib/cookies"

const backendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const mobile = normaliseAdminMobile(String(body.mobile ?? ""))
  const password = String(body.password ?? "")

  if (mobile !== ADMIN_MOBILE || !password) {
    return NextResponse.json(
      { message: "This studio login is reserved for the admin." },
      { status: 401 }
    )
  }

  const response = await fetch(`${backendUrl}/auth/user/emailpass`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password }),
    cache: "no-store",
  })

  if (!response.ok) {
    return NextResponse.json(
      { message: "The password is not correct." },
      { status: 401 }
    )
  }

  const { token } = (await response.json()) as { token: string }
  const nextResponse = NextResponse.json({ ok: true })
  nextResponse.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookies,
    path: "/",
    maxAge: 60 * 60 * 8,
  })

  return nextResponse
}
