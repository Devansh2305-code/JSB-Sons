import type { Metadata, Viewport } from "next"
import { Archivo, Bodoni_Moda, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"

const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
})

const sans = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "JSB Sons — Clothes for the life you're building",
    template: "%s · JSB Sons",
  },
  description:
    "Contemporary uniforms, everyday essentials and occasion wear, from our Sadar Bazar shop in Gurugram. A wardrobe for wherever the day takes you.",
  keywords: [
    "JSB Sons",
    "Gurugram clothing store",
    "Indian fashion",
    "uniforms",
    "formal wear",
    "ethnic wear",
  ],
}

export const viewport: Viewport = {
  themeColor: "#f2ece0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  )
}
