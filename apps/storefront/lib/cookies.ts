import { resolveSiteUrl } from "@/lib/site-url"

export const secureCookies = resolveSiteUrl().protocol === "https:"
