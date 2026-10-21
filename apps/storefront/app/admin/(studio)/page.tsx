import Link from "next/link"
import {
  ADMIN_ORDER_FIELDS,
  BACKEND_URL,
  adminFetch,
  getNotifications,
  orderStatus,
  requireAdmin,
  type AdminCustomer,
  type AdminInventoryItem,
  type AdminOrder,
  type AdminProduct,
} from "@/lib/admin-api"
import { formatDate, formatMoney } from "@/lib/format"

export default async function AdminDashboardPage() {
  const token = await requireAdmin()

  const [ordersData, productsData, customersData, notifications, inventoryData] =
    await Promise.all([
      adminFetch<{ orders: AdminOrder[]; count: number }>(
        `/admin/orders?limit=100&fields=${encodeURIComponent(ADMIN_ORDER_FIELDS)}`,
        token
      ),
      adminFetch<{ products: AdminProduct[]; count: number }>(
        "/admin/products?limit=1",
        token
      ),
      adminFetch<{ customers: AdminCustomer[]; count: number }>(
        "/admin/customers?limit=1",
        token
      ),
      getNotifications(token),
      adminFetch<{ inventory_items: AdminInventoryItem[]; count: number }>(
        "/admin/inventory-items?limit=500&fields=id,sku,title,stocked_quantity,reserved_quantity,*location_levels",
        token
      ).catch(() => ({ inventory_items: [], count: 0 })),
    ])

  const orders = ordersData.orders ?? []
  const revenue = orders
    .filter((order) => orderStatus(order) !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total ?? 0), 0)

  const lowStock = (inventoryData.inventory_items ?? []).filter((item) => {
    const available = item.location_levels?.length
      ? item.location_levels.reduce(
          (sum, level) => sum + Number(level.available_quantity ?? 0),
          0
        )
      : Number(item.stocked_quantity ?? 0) - Number(item.reserved_quantity ?? 0)
    return available <= 5
  }).length

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date())

  const stats = [
    { label: "Order value", value: formatMoney(revenue, "inr") },
    { label: "Orders", value: String(ordersData.count ?? 0) },
    { label: "Customers", value: String(customersData.count ?? 0) },
    { label: "Low stock SKUs", value: String(lowStock) },
  ]

  return (
    <>
      <header className="admin-topbar">
        <div>
          <span className="eyebrow">{today}</span>
          <h1>Studio overview</h1>
        </div>
        <div className="admin-topbar-actions">
          <span className="admin-live">
            <i />
            Live store
          </span>
          <a
            href={`${BACKEND_URL}/app`}
            target="_blank"
            rel="noreferrer"
            className="button button-dark"
          >
            Open Medusa admin
          </a>
        </div>
      </header>

      <section className="admin-stats">
        {stats.map((stat) => (
          <div className="admin-stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <span className="eyebrow">Most recent</span>
              <h2>Orders</h2>
            </div>
            <Link href="/admin/orders">View all</Link>
          </div>

          {orders.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 6).map((order) => {
                    const customer = order.customer
                    const name =
                      [customer?.first_name, customer?.last_name]
                        .filter(Boolean)
                        .join(" ") || order.email || "Guest"
                    const status = orderStatus(order)
                    return (
                      <tr key={order.id}>
                        <td>
                          <Link href={`/admin/orders/${order.id}`}>
                            #{order.display_id}
                          </Link>
                          <small>{formatDate(order.created_at)}</small>
                        </td>
                        <td>{name}</td>
                        <td>
                          <span className={`status-pill status-${status}`}>
                            {status}
                          </span>
                        </td>
                        <td>{formatMoney(order.total, order.currency_code)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="admin-empty">No orders yet. The first one will land here.</p>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <span className="eyebrow">Inbox</span>
              <h2>Notifications</h2>
            </div>
            <Link href="/admin/notifications">
              {notifications.unread_count} unread
            </Link>
          </div>

          <div className="admin-notification-list">
            {notifications.notifications.length ? (
              notifications.notifications.slice(0, 5).map((notification) => (
                <Link
                  key={notification.id}
                  href={
                    notification.order_id
                      ? `/admin/orders/${notification.order_id}`
                      : "/admin/notifications"
                  }
                  className={
                    notification.is_read
                      ? "admin-notification"
                      : "admin-notification is-unread"
                  }
                >
                  <div>
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                  </div>
                  <span>{formatDate(notification.created_at)}</span>
                </Link>
              ))
            ) : (
              <p className="admin-empty">The inbox is quiet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="admin-quick">
        <Link href="/admin/products">
          <span>01</span>
          <strong>Catalog</strong>
          <small>{productsData.count ?? 0} products</small>
        </Link>
        <Link href="/admin/orders">
          <span>02</span>
          <strong>Fulfilment</strong>
          <small>Move orders through the studio</small>
        </Link>
        <Link href="/admin/customers">
          <span>03</span>
          <strong>Customers</strong>
          <small>{customersData.count ?? 0} on the house list</small>
        </Link>
        <Link href="/admin/database">
          <span>04</span>
          <strong>Database</strong>
          <small>Inspect the local store</small>
        </Link>
      </section>
    </>
  )
}
