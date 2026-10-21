import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { syncOrderToSheet } from "../../../../../lib/sheets"
import { updateOrderStatusWorkflow } from "../../../../../workflows/update-order-status"

const ALLOWED_STATUSES = [
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
] as const

export async function POST(
  req: MedusaRequest<{ status?: string }>,
  res: MedusaResponse
) {
  const status =
    typeof req.body?.status === "string" ? req.body.status.toLowerCase() : ""

  if (!ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
    res.status(400).json({
      message: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
    })
    return
  }

  const { result } = await updateOrderStatusWorkflow(req.scope).run({
    input: {
      order_id: req.params.id,
      status,
    },
  })

  await syncOrderToSheet(req.scope, req.params.id).catch(() => undefined)

  res.json(result)
}
