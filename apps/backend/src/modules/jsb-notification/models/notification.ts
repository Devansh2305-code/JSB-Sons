import { model } from "@medusajs/framework/utils"

const JsbNotification = model.define("jsb_notification", {
  id: model.id().primaryKey(),
  type: model.text().default("order"),
  title: model.text(),
  message: model.text(),
  order_id: model.text().nullable(),
  order_display_id: model.number().nullable(),
  customer_name: model.text().nullable(),
  amount: model.bigNumber().nullable(),
  currency_code: model.text().nullable(),
  is_read: model.boolean().default(false),
  metadata: model.json().nullable(),
})

export default JsbNotification
