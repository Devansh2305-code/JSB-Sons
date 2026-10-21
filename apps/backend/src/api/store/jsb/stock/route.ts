import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

type InventoryItem = {
  sku: string | null
  stocked_quantity: number
  location_levels?: { available_quantity: number }[]
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: items } = await query.graph({
    entity: "inventory_item",
    fields: [
      "sku",
      "stocked_quantity",
      "location_levels.available_quantity",
    ],
    pagination: { take: 2000, skip: 0 },
  })

  const stock = (items as InventoryItem[]).reduce<Record<string, number>>(
    (acc, item) => {
      if (!item.sku) {
        return acc
      }

      const available = (item.location_levels ?? []).reduce(
        (sum, level) => sum + (level.available_quantity ?? 0),
        0
      )

      acc[item.sku] = available
      return acc
    },
    {}
  )

  res.json({ stock })
}
