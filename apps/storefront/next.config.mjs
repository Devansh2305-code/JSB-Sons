/** @type {import('next').NextConfig} */

function resolveUrl(value, fallback) {
  const raw = (value ?? "").trim()
  if (!raw) return new URL(fallback)

  try {
    return new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`)
  } catch {
    return new URL(fallback)
  }
}

const backendUrl = resolveUrl(
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
  "http://localhost:9000"
)

const backendImageSource = {
  protocol: backendUrl.protocol.replace(":", ""),
  hostname: backendUrl.hostname,
  pathname: "/**",
}

if (backendUrl.port) {
  backendImageSource.port = backendUrl.port
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [backendImageSource],
  },
}

export default nextConfig
