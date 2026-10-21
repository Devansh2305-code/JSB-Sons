"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, type FormEvent } from "react"
import { STORE } from "@/lib/store"
import { useCart } from "./cart-provider"
import {
  ArrowUpRightIcon,
  BagIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "./icons"

const navigation = [
  { label: "Shop all", href: "/shop" },
  { label: "Five worlds", href: "/#worlds" },
  { label: "The house", href: "/#house" },
  { label: "Visit the shop", href: "/#visit" },
]

const worlds = [
  { label: "Uniforms", href: "/shop?category=uniforms" },
  { label: "Casual / Daily", href: "/shop?category=casual-daily" },
  { label: "Party", href: "/shop?category=party" },
  { label: "Formal", href: "/shop?category=formal" },
  { label: "Ethnic", href: "/shop?category=ethnic" },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { itemCount } = useCart()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState("")

  useEffect(() => {
    setSearchOpen(false)
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const open = searchOpen || menuOpen
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [searchOpen, menuOpen])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [])

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = query.trim()
    setSearchOpen(false)
    router.push(value ? `/shop?q=${encodeURIComponent(value)}` : "/shop")
  }

  return (
    <>
      <header className="site-header">
        <div className="announcement">
          <div className="announcement-track">
            {[0, 1, 2, 3].map((item) => (
              <span key={item}>
                Complimentary shipping over ₹4,999
                <i />
                New week, new uniforms
                <i />
                Gurugram atelier, made in India
                <i />
              </span>
            ))}
          </div>
        </div>

        <div className="nav-shell">
          <nav className="nav-left" aria-label="Primary navigation">
            <button
              type="button"
              className="nav-menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="wordmark" aria-label="JSB Sons home">
            <span className="wordmark-main">JSB</span>
            <span className="wordmark-sub">
              SONS
              <small>Gurugram · est. 1998</small>
            </span>
          </Link>

          <div className="nav-right">
            <button
              type="button"
              className="nav-icon-button nav-search"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <SearchIcon />
              <span>Search</span>
            </button>
            <Link href="/account" className="nav-icon-button" aria-label="Account">
              <UserIcon />
              <span>Account</span>
            </Link>
            <Link href="/cart" className="nav-icon-button nav-bag" aria-label="Bag">
              <BagIcon />
              <span>Bag</span>
              <sup>{String(itemCount).padStart(2, "0")}</sup>
            </Link>
          </div>
        </div>
      </header>

      <div className={`search-panel ${searchOpen ? "is-open" : ""}`}>
        <button
          type="button"
          className="overlay-close"
          onClick={() => setSearchOpen(false)}
          aria-label="Close search"
        >
          <CloseIcon />
        </button>
        <div className="search-inner">
          <span className="eyebrow">Search the wardrobe</span>
          <form onSubmit={submitSearch} className="search-form">
            <input
              autoFocus={searchOpen}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What are you looking for?"
              aria-label="Search products"
            />
            <button type="submit" aria-label="Submit search">
              <ArrowUpRightIcon />
            </button>
          </form>
          <div className="search-suggestions">
            <span className="eyebrow">Start with a world</span>
            <div>
              {worlds.map((world) => (
                <Link
                  key={world.href}
                  href={world.href}
                  onClick={() => setSearchOpen(false)}
                >
                  {world.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
        <div className="mobile-menu-top">
          <span className="eyebrow">JSB Sons · Gurugram</span>
          <button
            type="button"
            className="overlay-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          <Link href="/shop">
            <span>01</span>Shop all
          </Link>
          {worlds.map((world, index) => (
            <Link key={world.href} href={world.href}>
              <span>{String(index + 2).padStart(2, "0")}</span>
              {world.label}
            </Link>
          ))}
          <Link href="/#visit">
            <span>07</span>Visit the shop
          </Link>
          <Link href="/account">
            <span>08</span>Account
          </Link>
          <Link href="/cart">
            <span>09</span>Bag ({itemCount})
          </Link>
        </nav>
        <div className="mobile-menu-foot">
          <a href={`tel:${STORE.phone}`}>{STORE.phoneDisplay}</a>
          <span>Sadar Bazar, Gurugram</span>
        </div>
      </div>
    </>
  )
}
