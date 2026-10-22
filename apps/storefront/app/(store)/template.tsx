"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export default function StoreTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className={pathname === "/" ? undefined : "page-enter"}>
      {children}
    </div>
  )
}
