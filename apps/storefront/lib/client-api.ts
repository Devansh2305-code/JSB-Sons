const backendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

export async function clientStoreFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${backendUrl}${path}`, {
    ...init,
    headers: {
      "x-publishable-api-key": publishableKey,
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error.slice(0, 320) || "Something went wrong.")
  }

  return response.json() as Promise<T>
}
