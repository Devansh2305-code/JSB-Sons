import { NextResponse } from "next/server"
import { ADMIN_COOKIE } from "@/lib/admin-api"
import { secureCookies } from "@/lib/cookies"

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: secureCookies,
    path: "/",
    maxAge: 0,
  })
  return response
}
