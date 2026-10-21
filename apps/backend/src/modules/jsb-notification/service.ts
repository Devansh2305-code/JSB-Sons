import { MedusaService } from "@medusajs/framework/utils"
import JsbNotification from "./models/notification"

class JsbNotificationService extends MedusaService({
  JsbNotification,
}) {}

export default JsbNotificationService
