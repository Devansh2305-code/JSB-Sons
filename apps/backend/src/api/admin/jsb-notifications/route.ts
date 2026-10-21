import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type JsbNotificationService from "../../../modules/jsb-notification/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const notificationService = req.scope.resolve<JsbNotificationService>(
    "jsb_notification"
  )

  const notifications = await notificationService.listJsbNotifications(
    {},
    { order: { created_at: "DESC" }, take: 30 }
  )
  const unread = await notificationService.listJsbNotifications({
    is_read: false,
  })

  res.json({
    notifications,
    unread_count: unread.length,
  })
}
