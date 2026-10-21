import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import type JsbNotificationService from "../modules/jsb-notification/service"

type OrderPlacedPayload = {
  id: string
}

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<OrderPlacedPayload>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notificationService = container.resolve<JsbNotificationService>(
    "jsb_notification"
  )

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "total",
      "customer.first_name",
      "customer.last_name",
      "shipping_address.first_name",
      "shipping_address.last_name",
    ],
    filters: { id: event.data.id },
  })

  const order = orders[0]

  if (!order) {
    return
  }

  const customerName =
    [order.shipping_address?.first_name, order.shipping_address?.last_name]
      .filter(Boolean)
      .join(" ") ||
    [order.customer?.first_name, order.customer?.last_name]
      .filter(Boolean)
      .join(" ") ||
    order.email ||
    "A customer"

  const name = typeof customerName === "string" ? customerName : "A customer"

  await notificationService.createJsbNotifications({
    type: "order",
    title: `New order #${order.display_id}`,
    message: `${name} placed a new order.`,
    order_id: order.id,
    order_display_id: Number(order.display_id),
    customer_name: name,
    amount: order.total,
    currency_code: order.currency_code,
    is_read: false,
    metadata: { source: "order.placed" },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
