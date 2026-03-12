export const dynamic = "force-dynamic"

import Link from "next/link"
import { notFound } from "next/navigation"
import { buildApiUrl, formatKes } from "@/lib/api"
import { getOrderStatus } from "@/lib/catalog"

type OrderStatusPageProps = {
  params: Promise<{ token: string }>
}

export default async function OrderStatusPage({ params }: OrderStatusPageProps) {
  const { token } = await params
  const order = await getOrderStatus(token).catch(() => null)

  if (!order) {
    notFound()
  }

  return (
    <main>
      <section className="page-section">
        <div className="container">
          <div className="admin-page-head order-page-head">
            <div>
              <p className="eyebrow">Order Status</p>
              <h1 className="page-title">Payment tracking for your drawing pack.</h1>
              <p className="page-copy">
                Order #{order.id} is currently <strong>{order.status}</strong>. Downloads unlock automatically when payment is confirmed.
              </p>
            </div>
            <span className={`status-pill status-pill-${order.status}`}>{order.status}</span>
          </div>

          <div className="admin-overview-grid order-status-grid">
            <article className="content-card admin-panel-card">
              <h2 className="section-title-mini">Order summary</h2>
              <div className="admin-order-summary">
                <p><strong>Email:</strong> {order.customer_email}</p>
                <p><strong>Payment provider:</strong> {order.payment_provider ?? "Pending"}</p>
                <p><strong>Payment reference:</strong> {order.payment_reference ?? "Pending"}</p>
                <p><strong>Total:</strong> {formatKes(order.total_amount)}</p>
                <p><strong>Amount paid:</strong> {formatKes(order.amount_paid)}</p>
              </div>
              {order.project_notes ? (
                <p className="section-copy">{order.project_notes}</p>
              ) : null}
            </article>

            <article className="content-card admin-panel-card">
              <h2 className="section-title-mini">Selected add-ons</h2>
              {order.selected_add_ons.length > 0 ? (
                <div className="tag-row">
                  {order.selected_add_ons.map((addOn) => (
                    <span key={addOn.id} className="tag">{addOn.name}</span>
                  ))}
                </div>
              ) : (
                <p className="section-copy">No technical add-ons were selected for this order.</p>
              )}

              <div className="hero-actions">
                {order.can_download ? (
                  <a className="button" href={buildApiUrl(`/api/download/${order.download_token}`)}>
                    Download drawing pack
                  </a>
                ) : null}
                <Link href="/plans" className="button button-secondary">
                  Browse more plans
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}
