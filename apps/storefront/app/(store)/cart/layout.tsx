import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your bag",
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
