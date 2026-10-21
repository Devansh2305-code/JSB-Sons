import { NextResponse } from "next/server"
import { CUSTOMER_COOKIE } from "@/lib/customer-auth-server"
import { secureCookies } from "@/lib/cookies"

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(CUSTOMER_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookies,
    path: "/",
    maxAge: 0,
  })
  return response
}
