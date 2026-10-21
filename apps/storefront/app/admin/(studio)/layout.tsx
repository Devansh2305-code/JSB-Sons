import { AdminSidebar } from "@/components/admin-sidebar"
import { getNotifications, requireAdmin } from "@/lib/admin-api"

export default async function AdminStudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = await requireAdmin()
  const notificationData = await getNotifications(token).catch(() => ({
    notifications: [],
    unread_count: 0,
  }))

  return (
    <div className="admin-root">
      <div className="admin-shell">
        <AdminSidebar unreadCount={notificationData.unread_count} />
        <div className="admin-main">{children}</div>
      </div>
    </div>
  )
}
