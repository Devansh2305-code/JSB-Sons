import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import type JsbNotificationService from "../../../../../modules/jsb-notification/service"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const notificationService = req.scope.resolve<JsbNotificationService>(
    "jsb_notification"
  )

  const notification = await notificationService.updateJsbNotifications({
    id: req.params.id,
    is_read: true,
  })

  res.json({ notification })
}
