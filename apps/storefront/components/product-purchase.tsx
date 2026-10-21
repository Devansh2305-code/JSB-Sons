"use client"

import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"
import { formatMoney } from "@/lib/format"
import type { StoreProduct, StoreVariant } from "@/lib/types"
import { useCart } from "./cart-provider"
import { CheckIcon, MinusIcon, PlusIcon } from "./icons"

type Selection = Record<string, string>

function selectionFromVariant(variant: StoreVariant): Selection {
  return variant.options.reduce<Selection>((selection, option) => {
    selection[option.option?.title ?? option.option_id] = option.value
    return selection
  }, {})
}

function variantForSelection(
  product: StoreProduct,
  selection: Selection
): StoreVariant | undefined {
  return product.variants.find((variant) =>
    variant.options.every(
      (option) => selection[option.option?.title ?? option.option_id] === option.value
    )
  )
}

function isValueAvailable(
  product: StoreProduct,
  selection: Selection,
  optionTitle: string,
  value: string
): boolean {
  const nextSelection = { ...selection, [optionTitle]: value }
  const variant = variantForSelection(product, nextSelection)
  return Boolean(variant && (product.stockBySku[variant.sku] ?? 0) > 0)
}

export function ProductPurchase({ product }: { product: StoreProduct }) {
  const { addItem, loading } = useCart()
  const initialVariant =
    product.variants.find(
      (variant) => (product.stockBySku[variant.sku] ?? 0) > 0
    ) ?? product.variants[0]

  const [selection, setSelection] = useState<Selection>(
    initialVariant ? selectionFromVariant(initialVariant) : {}
  )
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState<ReactNode>(null)
  const [error, setError] = useState("")

  const variant = useMemo(
    () => variantForSelection(product, selection),
    [product, selection]
  )
  const stock = variant ? (product.stockBySku[variant.sku] ?? 0) : 0
  const price = variant?.calculated_price?.calculated_amount ?? product.price

  async function handleAdd() {
    if (!variant || stock < 1) {
      return
    }

    setError("")
    setMessage(null)
    try {
      await addItem(variant.id, quantity)
      setMessage(
        <span>
          Added to your bag.{" "}
          <Link href="/cart">View bag</Link>
        </span>
      )
    } catch (caught) {
      setError(
        caught instanceof Error
          ? "That size could not be added. Please refresh and try again."
          : "Something went wrong."
      )
    }
  }

  return (
    <div className="purchase-panel">
      <div className="purchase-price">
        <span>{formatMoney(price)}</span>
        <small>MRP incl. of all taxes</small>
      </div>

      {product.options.map((option) => (
        <fieldset key={option.id} className="option-field">
          <legend>
            <span>{option.title}</span>
            <span className="option-current">{selection[option.title]}</span>
          </legend>
          <div className="option-values">
            {option.values.map((value) => {
              const available = isValueAvailable(
                product,
                selection,
                option.title,
                value.value
              )
              const active = selection[option.title] === value.value

              return (
                <button
                  key={value.id}
                  type="button"
                  className={`${active ? "is-active" : ""} ${
                    !available ? "is-unavailable" : ""
                  }`}
                  onClick={() =>
                    setSelection((current) => ({
                      ...current,
                      [option.title]: value.value,
                    }))
                  }
                  aria-pressed={active}
                >
                  {value.value}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}

      <div className="purchase-stock">
        <span className={stock > 0 ? "stock-dot" : "stock-dot is-out"} />
        {stock > 0
          ? stock < 8
            ? `Only ${stock} left · ${product.metadata?.stock_note ?? "Ready to dispatch"}`
            : "In stock · dispatched within 24–48 hours"
          : "This combination is currently unavailable"}
      </div>

      <div className="purchase-actions">
        <div className="quantity-stepper" aria-label="Quantity">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <MinusIcon />
          </button>
          <span>{quantity}</span>
          <button
            type="button"
            onClick={() =>
              setQuantity((current) =>
                Math.min(stock > 0 ? stock : 1, current + 1, 10)
              )
            }
            disabled={quantity >= Math.min(stock || 1, 10)}
            aria-label="Increase quantity"
          >
            <PlusIcon />
          </button>
        </div>

        <button
          type="button"
          className="button button-dark add-to-bag"
          onClick={handleAdd}
          disabled={loading || !variant || stock < 1}
        >
          {loading
            ? "Adding…"
            : stock > 0
              ? "Add to bag"
              : "Currently unavailable"}
          {stock > 0 ? <PlusIcon /> : null}
        </button>
      </div>

      <div className="purchase-feedback" aria-live="polite">
        {error ? <span className="form-error">{error}</span> : message}
      </div>

      <div className="purchase-notes">
        <span>
          <CheckIcon /> Free shipping over ₹4,999
        </span>
        <span>
          <CheckIcon /> 7-day returns
        </span>
        <span>
          <CheckIcon /> GST invoice included
        </span>
      </div>

      {variant ? (
        <span className="purchase-sku">SKU {variant.sku}</span>
      ) : null}
    </div>
  )
}
