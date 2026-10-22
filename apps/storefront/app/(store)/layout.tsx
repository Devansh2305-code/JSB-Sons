import { CartProvider } from "@/components/cart-provider"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { getRegionId } from "@/lib/api"

export const dynamic = "force-dynamic"

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const regionId = await getRegionId()

  return (
    <CartProvider regionId={regionId}>
      <Header />
      <main className="site-main">{children}</main>
      <Footer />
    </CartProvider>
  )
}
