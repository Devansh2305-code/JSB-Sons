"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/admin/database", label: "Database" },
]

export function AdminSidebar({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.replace("/admin/login")
  }

  return (
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand">
        JSB <small>STUDIO</small>
      </Link>

      <nav className="admin-nav" aria-label="Admin navigation">
        {links.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? "is-active" : ""}
            >
              {link.label}
              {link.href === "/admin/notifications" && unreadCount > 0 ? (
                <span>{unreadCount}</span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      <div className="admin-sidebar-bottom">
        <Link href="/" target="_blank">
          View storefront
        </Link>
        <a href="http://localhost:9000/app" target="_blank" rel="noreferrer">
          Full Medusa admin
        </a>
        <button type="button" onClick={logout}>
          Sign out
        </button>
      </div>
    </aside>
  )
}
