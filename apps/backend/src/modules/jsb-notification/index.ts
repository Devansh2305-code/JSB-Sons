import { Module } from "@medusajs/framework/utils"
import JsbNotificationService from "./service"

export const JSB_NOTIFICATION_MODULE = "jsb_notification"

export default Module(JSB_NOTIFICATION_MODULE, {
  service: JsbNotificationService,
})
