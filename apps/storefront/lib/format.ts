export function imagePath(url?: string | null): string {
  if (!url) {
    return "/products/13065308.jpg"
  }

  try {
    const parsed = new URL(url)
    if (parsed.pathname.startsWith("/products/")) {
      return parsed.pathname
    }
  } catch {
    if (url.startsWith("/")) {
      return url
    }
  }

  return url
}

export function formatMoney(
  amount: number | null | undefined,
  currency = "INR"
): string {
  const value = amount ?? 0
  const hasPaise = Math.round(value * 100) % 100 !== 0

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: hasPaise ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}
