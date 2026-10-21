import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { sheetSyncEnabled, syncOrderToSheet } from "../lib/sheets"

export default async function syncOrdersToSheet({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  if (!sheetSyncEnabled()) {
    logger.warn(
      "GOOGLE_SHEETS_WEBHOOK_URL is not set. Add it to the backend environment first."
    )
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "display_id"],
  })

  logger.info(`Syncing ${orders.length} orders to Google Sheets`)

  for (const order of orders) {
    await syncOrderToSheet(container, order.id)
  }

  logger.info("Google Sheets order sync complete")
}
