"use server"

import { revalidatePath } from "next/cache"
import {
  adminFetch,
  adminToken,
  getNotifications,
} from "@/lib/admin-api"

async function tokenOrThrow() {
  const token = adminToken()
  if (!token) {
    throw new Error("Admin session expired.")
  }
  return token
}

export async function updateOrderStatusAction(formData: FormData) {
  const token = await tokenOrThrow()
  const orderId = String(formData.get("order_id") ?? "")
  const status = String(formData.get("status") ?? "")

  if (!orderId || !status) {
    return
  }

  await adminFetch(`/admin/jsb-orders/${orderId}/status`, token, {
    method: "POST",
    body: JSON.stringify({ status }),
  })

  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath("/admin/orders")
  revalidatePath("/admin")
}

export async function markNotificationReadAction(formData: FormData) {
  const token = await tokenOrThrow()
  const id = String(formData.get("id") ?? "")

  if (!id) {
    return
  }

  await adminFetch(`/admin/jsb-notifications/${id}/read`, token, {
    method: "POST",
    body: JSON.stringify({}),
  })

  revalidatePath("/admin/notifications")
  revalidatePath("/admin")
}

export async function markAllNotificationsReadAction() {
  const token = await tokenOrThrow()
  const { unread_count } = await getNotifications(token)

  if (!unread_count) {
    return
  }

  await adminFetch("/admin/jsb-notifications/read-all", token, {
    method: "POST",
    body: JSON.stringify({}),
  })

  revalidatePath("/admin/notifications")
  revalidatePath("/admin")
}
