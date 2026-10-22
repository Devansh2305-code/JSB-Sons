const FALLBACK_SITE_URL = "http://localhost:3000"

export function resolveSiteUrl(value = process.env.NEXT_PUBLIC_SITE_URL) {
  const raw = (value ?? "").trim()
  if (!raw) return new URL(FALLBACK_SITE_URL)

  try {
    return new URL(
      /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`
    )
  } catch {
    return new URL(FALLBACK_SITE_URL)
  }
}
