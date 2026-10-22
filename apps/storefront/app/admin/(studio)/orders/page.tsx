import Link from "next/link"
import {
  ADMIN_ORDER_FIELDS,
  adminFetch,
  orderStatus,
  requireAdmin,
  type AdminOrder,
} from "@/lib/admin-api"
import { formatDate, formatMoney } from "@/lib/format"

const STATUS_FILTERS = [
  "all",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "pending",
]

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { q?: string; status?: string }
}) {
  const token = await requireAdmin()
  const q = searchParams.q?.trim() ?? ""
  const activeStatus = searchParams.status ?? "all"

  const data = await adminFetch<{ orders: AdminOrder[]; count: number }>(
    `/admin/orders?limit=100&fields=${encodeURIComponent(
      ADMIN_ORDER_FIELDS
    )}${q ? `&q=${encodeURIComponent(q)}` : ""}`,
    token
  )

  const allOrders = data.orders ?? []
  const orders =
    activeStatus === "all"
      ? allOrders
      : allOrders.filter((order) => orderStatus(order) === activeStatus)

  const counts = allOrders.reduce<Record<string, number>>((result, order) => {
    const status = orderStatus(order)
    result[status] = (result[status] ?? 0) + 1
    return result
  }, {})

  return (
    <>
      <header className="admin-topbar">
        <div>
          <span className="eyebrow">Fulfilment</span>
          <h1>Orders</h1>
        </div>
        <div className="admin-topbar-actions">
          <span className="admin-count">{data.count ?? 0} total</span>
        </div>
      </header>

      <div className="admin-filter-row">
        {STATUS_FILTERS.map((status) => (
          <Link
            key={status}
            href={
              status === "all"
                ? "/admin/orders"
                : `/admin/orders?status=${status}`
            }
            className={activeStatus === status ? "is-active" : ""}
          >
            {status}
            <span>
              {status === "all" ? allOrders.length : (counts[status] ?? 0)}
            </span>
          </Link>
        ))}
      </div>

      <form className="admin-search" action="/admin/orders">
        {activeStatus !== "all" ? (
          <input type="hidden" name="status" value={activeStatus} />
        ) : null}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Order no. or email"
          aria-label="Search orders"
        />
        <button type="submit" className="button">
          Search
        </button>
      </form>

      <section className="admin-panel">
        {orders.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table admin-table-wide">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Payment</th>
                  <th>Studio status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status = orderStatus(order)
                  const customer = order.customer
                  const name =
                    [customer?.first_name, customer?.last_name]
                      .filter(Boolean)
                      .join(" ") || "Guest"
                  return (
                    <tr key={order.id}>
                      <td>
                        <Link href={`/admin/orders/${order.id}`}>
                          #{order.display_id}
                        </Link>
                      </td>
                      <td>
                        {name}
                        <small>{order.email ?? customer?.email ?? "—"}</small>
                      </td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>
                        <span className="status-pill status-payment">
                          {order.payment_status ?? "awaiting"}
                        </span>
                      </td>
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
          <p className="admin-empty">
            No orders match this view. Clear the search or choose another
            status.
          </p>
        )}
      </section>
    </>
  )
}
