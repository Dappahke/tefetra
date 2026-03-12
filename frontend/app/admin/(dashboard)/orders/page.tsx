import { updateOrderAction } from "@/app/admin/actions"
import { formatKes } from "@/lib/api"
import { getAdminOrders } from "@/lib/admin-api"

const statusOptions = ["pending", "paid", "failed"]

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders()

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">Orders</p>
          <h2 className="page-title">Review payment states and download eligibility.</h2>
        </div>
      </div>

      <div className="admin-card-grid">
        {orders.map((order) => (
          <article key={order.id} className="content-card admin-edit-card">
            <div className="admin-card-head">
              <div>
                <h3>Order #{order.id}</h3>
                <p className="plan-meta">{order.customer_email}</p>
              </div>
              <span className={`status-pill status-pill-${order.status}`}>{order.status}</span>
            </div>

            <div className="admin-order-summary">
              <p><strong>Total:</strong> {formatKes(order.total_amount)}</p>
              <p><strong>Paid:</strong> {formatKes(order.amount_paid)}</p>
              <p><strong>Provider:</strong> {order.payment_provider ?? "Not set"}</p>
              <p><strong>Reference:</strong> {order.payment_reference ?? "Pending"}</p>
              <p><strong>Download token:</strong> {order.download_token}</p>
            </div>

            {order.selected_add_ons.length > 0 ? (
              <div className="tag-row">
                {order.selected_add_ons.map((addOn) => (
                  <span key={addOn.id} className="tag">{addOn.name}</span>
                ))}
              </div>
            ) : null}

            <form action={updateOrderAction} className="admin-form-grid compact-grid">
              <input type="hidden" name="order_id" value={order.id} />
              <label className="field">
                <span className="field-label">Status</span>
                <select className="select-input" name="status" defaultValue={order.status}>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Payment provider</span>
                <input className="text-input" type="text" name="payment_provider" defaultValue={order.payment_provider ?? ""} />
              </label>
              <label className="field">
                <span className="field-label">Payment reference</span>
                <input className="text-input" type="text" name="payment_reference" defaultValue={order.payment_reference ?? ""} />
              </label>
              <label className="field">
                <span className="field-label">Amount paid</span>
                <input className="text-input" type="number" min="0" step="0.01" name="amount_paid" defaultValue={order.amount_paid} />
              </label>
              <div className="field-full admin-card-actions">
                <button className="button" type="submit">Update order</button>
              </div>
            </form>
          </article>
        ))}
      </div>
    </div>
  )
}
