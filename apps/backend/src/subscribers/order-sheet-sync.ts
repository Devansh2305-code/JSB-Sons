import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { syncOrderToSheet } from "../lib/sheets"

type OrderPlacedPayload = {
  id: string
}

export default async function orderSheetSyncHandler({
  event,
  container,
}: SubscriberArgs<OrderPlacedPayload>) {
  await syncOrderToSheet(container, event.data.id)
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
