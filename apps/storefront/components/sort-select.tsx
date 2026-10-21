"use client"

import { useRouter, useSearchParams } from "next/navigation"

const options = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "A–Z" },
]

export function SortSelect({ value }: { value: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function change(nextValue: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (nextValue === "featured") {
      params.delete("sort")
    } else {
      params.set("sort", nextValue)
    }
    router.push(`/shop${params.size ? `?${params.toString()}` : ""}`)
  }

  return (
    <div className="sort-control">
      <label htmlFor="sort">Sort</label>
      <select
        id="sort"
        value={value}
        onChange={(event) => change(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
