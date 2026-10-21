import Link from "next/link"
import {
  ADMIN_ORDER_FIELDS,
  BACKEND_URL,
  adminFetch,
  getNotifications,
  orderStatus,
  requireAdmin,
  type AdminOrder,
} from "@/lib/admin-api"
import { formatDate, formatMoney } from "@/lib/format"

export default async function AdminDatabasePage() {
  const token = await requireAdmin()

  const [
    products,
    orders,
    customers,
    categories,
    collections,
    regions,
    locations,
    notifications,
  ] = await Promise.all([
    adminFetch<{ count: number }>("/admin/products?limit=1", token),
    adminFetch<{ orders: AdminOrder[]; count: number }>(
      `/admin/orders?limit=8&fields=${encodeURIComponent(ADMIN_ORDER_FIELDS)}`,
      token
    ),
    adminFetch<{ count: number }>("/admin/customers?limit=1", token),
    adminFetch<{ count: number }>("/admin/product-categories?limit=1", token),
    adminFetch<{ count: number }>("/admin/collections?limit=1", token),
    adminFetch<{ count: number }>("/admin/regions?limit=1", token),
    adminFetch<{ count: number }>("/admin/stock-locations?limit=1", token),
    getNotifications(token),
  ])

  const counts = [
    { label: "Products", value: products.count },
    { label: "Orders", value: orders.count },
    { label: "Customers", value: customers.count },
    { label: "Categories", value: categories.count },
    { label: "Collections", value: collections.count },
    { label: "Regions", value: regions.count },
    { label: "Stock locations", value: locations.count },
    { label: "Notifications", value: notifications.notifications.length },
  ]

  return (
    <>
      <header className="admin-topbar">
        <div>
          <span className="eyebrow">Under the counter</span>
          <h1>Database</h1>
        </div>
        <a
          href={`${BACKEND_URL}/app`}
          target="_blank"
          rel="noreferrer"
          className="button button-dark"
        >
          Open Medusa admin
        </a>
      </header>

      <section className="admin-stats admin-stats-db">
        {counts.map((count) => (
          <div className="admin-stat" key={count.label}>
            <span>{count.label}</span>
            <strong>{count.value ?? 0}</strong>
          </div>
        ))}
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <span className="eyebrow">Latest writes</span>
              <h2>Recent orders</h2>
            </div>
            <Link href="/admin/orders">View all</Link>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {(orders.orders ?? []).map((order) => {
                  const status = orderStatus(order)
                  return (
                    <tr key={order.id}>
                      <td>
                        <Link href={`/admin/orders/${order.id}`}>
                          #{order.display_id}
                        </Link>
                      </td>
                      <td>{formatDate(order.created_at)}</td>
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
        </section>

        <section className="admin-panel admin-db-card">
          <span className="eyebrow">PostgreSQL</span>
          <h2>Direct access</h2>
          <dl>
            <div>
              <dt>Connection</dt>
              <dd>DATABASE_URL</dd>
            </div>
            <div>
              <dt>Port</dt>
              <dd>5432 (session)</dd>
            </div>
            <div>
              <dt>SSL</dt>
              <dd>Required when hosted</dd>
            </div>
          </dl>
          <p>
            Connect with pgAdmin, DBeaver or TablePlus using the connection
            string from the backend environment. Locally it is started by the
            project&apos;s embedded PostgreSQL task.
          </p>
          <a
            href={`${BACKEND_URL}/app/settings/store`}
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Store settings in Medusa →
          </a>
        </section>
      </div>

      <p className="admin-callout">
        This overview reads through the Medusa Admin API, so it reflects the
        same records the storefront uses. Product and order writes continue to
        live in Medusa&apos;s own tables.
      </p>
    </>
  )
}
