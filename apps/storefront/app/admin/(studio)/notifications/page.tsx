import Link from "next/link"
import { getNotifications, requireAdmin } from "@/lib/admin-api"
import { formatDate, formatMoney } from "@/lib/format"
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "../actions"

export default async function AdminNotificationsPage() {
  const token = await requireAdmin()
  const data = await getNotifications(token)
  const notifications = data.notifications ?? []

  return (
    <>
      <header className="admin-topbar">
        <div>
          <span className="eyebrow">Inbox</span>
          <h1>Notifications</h1>
        </div>
        <div className="admin-topbar-actions">
          <span className="admin-count">{data.unread_count} unread</span>
          {data.unread_count > 0 ? (
            <form action={markAllNotificationsReadAction}>
              <button type="submit" className="button">
                Mark all as read
              </button>
            </form>
          ) : null}
        </div>
      </header>

      <section className="admin-panel">
        {notifications.length ? (
          <div className="admin-inbox">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={
                  notification.is_read
                    ? "admin-inbox-item"
                    : "admin-inbox-item is-unread"
                }
              >
                <div className="admin-inbox-mark">
                  {!notification.is_read ? <i /> : null}
                </div>
                <div className="admin-inbox-body">
                  <div className="admin-inbox-head">
                    <strong>{notification.title}</strong>
                    <span>{formatDate(notification.created_at)}</span>
                  </div>
                  <p>{notification.message}</p>
                  <div className="admin-inbox-actions">
                    {notification.order_id ? (
                      <Link
                        href={`/admin/orders/${notification.order_id}`}
                        className="admin-row-link"
                      >
                        Open order #{notification.order_display_id}
                      </Link>
                    ) : null}
                    {notification.amount ? (
                      <span>
                        {formatMoney(
                          notification.amount,
                          notification.currency_code ?? "inr"
                        )}
                      </span>
                    ) : null}
                  </div>
                </div>
                {!notification.is_read ? (
                  <form action={markNotificationReadAction}>
                    <input type="hidden" name="id" value={notification.id} />
                    <button type="submit" className="admin-read-button">
                      Mark read
                    </button>
                  </form>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="admin-empty">
            No notifications yet. You will see new orders here as they arrive.
          </p>
        )}
      </section>
    </>
  )
}
