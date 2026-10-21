/** @type {import('next').NextConfig} */
const backendUrl = new URL(
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"
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
