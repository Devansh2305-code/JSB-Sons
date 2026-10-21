"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { Cart } from "@/lib/types"

type CartContextValue = {
  cart: Cart | null
  itemCount: number
  loading: boolean
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  refresh: () => Promise<void>
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const CART_STORAGE_KEY = "jsb_sons_cart_id"

const backendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000"
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""

async function cartRequest<T>(path: string, init?: RequestInit): Promise<T> {
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
    throw new Error(error.slice(0, 280) || "Something went wrong.")
  }

  return response.json() as Promise<T>
}

export function CartProvider({
  regionId,
  children,
}: {
  regionId: string
  children: ReactNode
}) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") {
      return
    }

    const cartId = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!cartId) {
      return
    }

    try {
      const data = await cartRequest<{ cart: Cart }>(`/store/carts/${cartId}`)
      setCart(data.cart)
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY)
      setCart(null)
    }
  }, [])

  useEffect(() => {
    void refresh()
    window.addEventListener("jsb:cart-updated", refresh)
    return () => window.removeEventListener("jsb:cart-updated", refresh)
  }, [refresh])

  const ensureCart = useCallback(async (): Promise<Cart> => {
    if (cart) {
      return cart
    }

    const existingId = window.localStorage.getItem(CART_STORAGE_KEY)
    if (existingId) {
      try {
        const existing = await cartRequest<{ cart: Cart }>(
          `/store/carts/${existingId}`
        )
        setCart(existing.cart)
        return existing.cart
      } catch {
        window.localStorage.removeItem(CART_STORAGE_KEY)
      }
    }

    const created = await cartRequest<{ cart: Cart }>("/store/carts", {
      method: "POST",
      body: JSON.stringify({ region_id: regionId }),
    })
    window.localStorage.setItem(CART_STORAGE_KEY, created.cart.id)
    setCart(created.cart)
    return created.cart
  }, [cart, regionId])

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setLoading(true)
      try {
        const activeCart = await ensureCart()
        const data = await cartRequest<{ cart: Cart }>(
          `/store/carts/${activeCart.id}/line-items`,
          {
            method: "POST",
            body: JSON.stringify({ variant_id: variantId, quantity }),
          }
        )
        setCart(data.cart)
      } finally {
        setLoading(false)
      }
    },
    [ensureCart]
  )

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      const activeCart = await ensureCart()
      setLoading(true)
      try {
        if (quantity <= 0) {
          await cartRequest(
            `/store/carts/${activeCart.id}/line-items/${itemId}`,
            { method: "DELETE" }
          )
        } else {
          await cartRequest(
            `/store/carts/${activeCart.id}/line-items/${itemId}`,
            {
              method: "POST",
              body: JSON.stringify({ quantity }),
            }
          )
        }
        const data = await cartRequest<{ cart: Cart }>(
          `/store/carts/${activeCart.id}`
        )
        setCart(data.cart)
      } finally {
        setLoading(false)
      }
    },
    [ensureCart]
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      await updateItem(itemId, 0)
    },
    [updateItem]
  )

  const clear = useCallback(() => {
    window.localStorage.removeItem(CART_STORAGE_KEY)
    setCart(null)
  }, [])

  const itemCount = useMemo(
    () =>
      (cart?.items ?? []).reduce(
        (total, item) => total + (item.quantity ?? 0),
        0
      ),
    [cart]
  )

  const value = useMemo(
    () => ({
      cart,
      itemCount,
      loading,
      addItem,
      updateItem,
      removeItem,
      refresh,
      clear,
    }),
    [cart, itemCount, loading, addItem, updateItem, removeItem, refresh, clear]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used inside CartProvider")
  }
  return context
}
