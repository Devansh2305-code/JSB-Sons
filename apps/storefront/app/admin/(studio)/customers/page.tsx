import {
  BACKEND_URL,
  adminFetch,
  requireAdmin,
  type AdminCustomer,
} from "@/lib/admin-api"
import { formatDate } from "@/lib/format"

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const token = await requireAdmin()
  const q = searchParams.q?.trim() ?? ""

  const data = await adminFetch<{ customers: AdminCustomer[]; count: number }>(
    `/admin/customers?limit=100${q ? `&q=${encodeURIComponent(q)}` : ""}`,
    token
  )

  const customers = data.customers ?? []

  return (
    <>
      <header className="admin-topbar">
        <div>
          <span className="eyebrow">The house list</span>
          <h1>Customers</h1>
        </div>
        <span className="admin-count">{data.count ?? 0} customers</span>
      </header>

      <form className="admin-search" action="/admin/customers">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name, mobile or email"
          aria-label="Search customers"
        />
        <button type="submit" className="button">
          Search
        </button>
      </form>

      <section className="admin-panel">
        {customers.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table admin-table-wide">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Joined</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => {
                  const name =
                    [customer.first_name, customer.last_name]
                      .filter(Boolean)
                      .join(" ") || "Unnamed customer"
                  const mobile =
                    customer.metadata?.mobile ?? customer.phone ?? "—"
                  const email = customer.email.endsWith(
                    "@customer.jsbsons.local"
                  )
                    ? "Mobile account"
                    : customer.email
                  return (
                    <tr key={customer.id}>
                      <td>
                        <strong>{name}</strong>
                      </td>
                      <td>{mobile}</td>
                      <td>{email}</td>
                      <td>{formatDate(customer.created_at)}</td>
                      <td>
                        <a
                          href={`${BACKEND_URL}/app/customers/${customer.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="admin-row-link"
                        >
                          Open →
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-empty">
            No customers yet. Accounts created on the storefront appear here.
          </p>
        )}
      </section>
    </>
  )
}
