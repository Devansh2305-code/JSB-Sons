import Link from "next/link"
import { STORE } from "@/lib/store"
import { ArrowUpRightIcon } from "./icons"

const worlds = [
  { label: "Uniforms", href: "/shop?category=uniforms" },
  { label: "Casual / Daily", href: "/shop?category=casual-daily" },
  { label: "Party", href: "/shop?category=party" },
  { label: "Formal", href: "/shop?category=formal" },
  { label: "Ethnic", href: "/shop?category=ethnic" },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-statement">
          <span className="eyebrow">The house of JSB Sons</span>
          <p>
            A good wardrobe is a quiet advantage. Built in Gurugram for
            wherever the day takes you.
          </p>
        </div>
        <div className="footer-column">
          <span className="eyebrow">The shop</span>
          <Link href="/shop">Shop all</Link>
          <Link href="/shop?sort=newest">New arrivals</Link>
          <Link href="/shop?sort=price-asc">Under ₹2,000</Link>
        </div>
        <div className="footer-column">
          <span className="eyebrow">Five worlds</span>
          {worlds.map((world) => (
            <Link key={world.href} href={world.href}>
              {world.label}
            </Link>
          ))}
        </div>
        <div className="footer-column">
          <span className="eyebrow">The fine print</span>
          <Link href="/account">Your account</Link>
          <Link href="/admin">Studio admin</Link>
          <span>{STORE.addressLines[0]}</span>
          <span>{STORE.addressLines[1]}</span>
          <span>{STORE.addressLines[2]}</span>
          <a href={`tel:${STORE.phone}`}>{STORE.phoneDisplay}</a>
          <a href={STORE.directionsUrl} target="_blank" rel="noreferrer">
            Get directions
          </a>
        </div>
      </div>

      <div className="footer-mark" aria-hidden="true">
        <span>JSB</span>
        <span>SONS</span>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} JSB Sons. Made in India.</span>
        <span>GST inclusive · secure checkout</span>
        <Link href="/shop">
          Return to the wardrobe <ArrowUpRightIcon />
        </Link>
      </div>
    </footer>
  )
}
