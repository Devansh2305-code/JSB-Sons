export const secureCookies = (
  process.env.NEXT_PUBLIC_SITE_URL ?? ""
).startsWith("https://")
