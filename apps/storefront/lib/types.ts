export type ProductMetadata = {
  fabric?: string
  fit?: string
  care?: string
  origin?: string
  delivery?: string
  is_new?: boolean
  color_family?: string[]
  stock_note?: string
  collection_label?: string
}

export type StoreImage = {
  id: string
  url: string
}

export type StoreOptionValue = {
  id: string
  value: string
  option_id: string
  option?: {
    id: string
    title: string
  }
}

export type StoreOption = {
  id: string
  title: string
  values: { id: string; value: string }[]
}

export type StorePrice = {
  calculated_amount: number
  original_amount: number
  currency_code: string
}

export type StoreVariant = {
  id: string
  title: string
  sku: string
  options: StoreOptionValue[]
  calculated_price?: StorePrice
  manage_inventory?: boolean
  allow_backorder?: boolean
}

export type StoreCategory = {
  id: string
  name: string
  description?: string | null
  handle: string
}

export type StoreCollection = {
  id: string
  title: string
  handle: string
}

export type StoreProduct = {
  id: string
  title: string
  subtitle?: string | null
  description?: string | null
  handle: string
  thumbnail?: string | null
  images: StoreImage[]
  options: StoreOption[]
  variants: StoreVariant[]
  collection?: StoreCollection | null
  categories?: StoreCategory[]
  metadata?: ProductMetadata
  price: number
  totalStock: number
  stockBySku: Record<string, number>
}

export type CartLineItem = {
  id: string
  title: string
  subtitle?: string | null
  thumbnail?: string | null
  product_handle?: string
  product_title?: string
  variant_id?: string
  variant_title?: string | null
  quantity: number
  unit_price: number
  total: number
}

export type Cart = {
  id: string
  email?: string | null
  currency_code: string
  item_total: number
  item_subtotal: number
  shipping_total: number
  tax_total: number
  total: number
  subtotal: number
  items?: CartLineItem[]
  shipping_methods?: { id: string; name?: string; amount: number }[]
  payment_collection?: { id: string } | null
}

export type ShippingOption = {
  id: string
  name: string
  amount: number
  price_type: string
  calculated_price?: {
    calculated_amount: number
    currency_code: string
  }
}

export type Customer = {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  metadata?: Record<string, unknown> | null
}
