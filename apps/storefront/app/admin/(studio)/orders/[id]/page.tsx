import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ADMIN_ORDER_DETAIL_FIELDS,
  adminFetch,
  orderStatus,
  requireAdmin,
  type AdminOrder,
} from "@/lib/admin-api"
import { formatDate, formatMoney, imagePath } from "@/lib/format"
import { updateOrderStatusAction } from "../../actions"

type OrderDetail = AdminOrder & {
  subtotal?: number
  shipping_total?: number
  tax_total?: number
  discount_total?: number
  shipping_methods?: { name: string; amount: number }[]
}

const STATUSES = [
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
]

export default async function AdminOrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const token = await requireAdmin()
  const data = await adminFetch<{ order: OrderDetail }>(
    `/admin/orders/${params.id}?fields=${encodeURIComponent(
      ADMIN_ORDER_DETAIL_FIELDS
    )}`,
    token
  ).catch(() => null)

  if (!data?.order) {
    notFound()
  }

  const order = data.order
  const currency = order.currency_code ?? "inr"
  const status = orderStatus(order)
  const customer = order.customer
  const address = order.shipping_address
  const customerName =
    [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") ||
    [address?.first_name, address?.last_name].filter(Boolean).join(" ") ||
    "Guest"

  return (
    <>
      <header className="admin-topbar">
        <div>
          <Link href="/admin/orders" className="admin-back">
            ← All orders
          </Link>
          <h1>Order #{order.display_id}</h1>
          <span className="admin-muted">
            Placed {formatDate(order.created_at)}
          </span>
        </div>
        <span className={`status-pill status-${status}`}>{status}</span>
      </header>

      <div className="admin-order-grid">
        <section className="admin-panel admin-order-main">
          <div className="admin-panel-head">
            <div>
              <span className="eyebrow">The pieces</span>
              <h2>Order items</h2>
            </div>
            <span>{order.items?.length ?? 0} lines</span>
          </div>

          <div className="admin-order-items">
            {(order.items ?? []).map((item) => (
              <div className="admin-order-item" key={item.id}>
                {item.thumbnail ? (
                  <img src={imagePath(item.thumbnail)} alt="" />
                ) : (
                  <span className="admin-order-thumb" />
                )}
                <div>
                  <strong>{item.product_title ?? item.title}</strong>
                  <span>{item.variant_title ?? "—"}</span>
                </div>
                <span>× {item.quantity}</span>
                <strong>{formatMoney(item.total, currency)}</strong>
              </div>
            ))}
          </div>

          <div className="admin-totals">
            <div>
              <span>Subtotal</span>
              <span>
                {formatMoney(order.subtotal ?? order.total, currency)}
              </span>
            </div>
            <div>
              <span>Shipping</span>
              <span>
                {formatMoney(order.shipping_total ?? 0, currency)}
              </span>
            </div>
            <div>
              <span>Tax</span>
              <span>{formatMoney(order.tax_total ?? 0, currency)}</span>
            </div>
            {order.discount_total ? (
              <div>
                <span>Discount</span>
                <span>−{formatMoney(order.discount_total, currency)}</span>
              </div>
            ) : null}
            <div className="admin-totals-grand">
              <span>Total</span>
              <strong>{formatMoney(order.total, currency)}</strong>
            </div>
          </div>

          <div className="admin-order-note">
            <p>
              Move the order through the studio as it progresses. These statuses
              are shown to the customer alongside Medusa&apos;s own order state.
            </p>
            <form action={updateOrderStatusAction} className="admin-status-form">
              <input type="hidden" name="order_id" value={order.id} />
              <label htmlFor="order-status">Studio status</label>
              <select id="order-status" name="status" defaultValue={status}>
                {STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              <button type="submit" className="button button-dark">
                Update status
              </button>
            </form>
          </div>
        </section>

        <aside className="admin-order-side">
          <section className="admin-panel">
            <span className="eyebrow">Customer</span>
            <h2>{customerName}</h2>
            <p>{order.email ?? customer?.email ?? "No email on file"}</p>
            {address?.phone ? <p>{address.phone}</p> : null}
          </section>

          <section className="admin-panel">
            <span className="eyebrow">Deliver to</span>
            {address ? (
              <address>
                {address.address_1}
                {address.address_2 ? <>, {address.address_2}</> : null}
                <br />
                {address.city}
                {address.province ? `, ${address.province}` : ""}
                <br />
                {address.postal_code} · {address.country_code?.toUpperCase()}
              </address>
            ) : (
              <p>No shipping address.</p>
            )}
          </section>

          <section className="admin-panel">
            <span className="eyebrow">Payment</span>
            <h2 className="admin-payment-status">
              {order.payment_status ?? "awaiting"}
            </h2>
            <p>
              {formatMoney(order.total, currency)} ·{" "}
              {currency.toUpperCase()}
            </p>
            <p className="admin-muted">
              System provider orders remain unpaid until payment is captured in
              Medusa.
            </p>
          </section>
        </aside>
      </div>
    </>
  )
}
