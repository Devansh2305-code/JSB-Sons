import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type JsbNotificationService from "../../../../modules/jsb-notification/service"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const notificationService = req.scope.resolve<JsbNotificationService>(
    "jsb_notification"
  )

  const unread = await notificationService.listJsbNotifications({
    is_read: false,
  })

  if (unread.length) {
    await notificationService.updateJsbNotifications(
      unread.map((notification) => ({
        id: notification.id,
        is_read: true,
      }))
    )
  }

  res.json({ updated: unread.length })
}
