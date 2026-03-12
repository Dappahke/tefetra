export const dynamic = "force-dynamic"

import Link from "next/link"
import { buildApiUrl, formatKes } from "@/lib/api"
import { getStripeSessionStatus } from "@/lib/catalog"

type StripeSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string
  }>
}

export default async function StripeSuccessPage({ searchParams }: StripeSuccessPageProps) {
  const params = await searchParams
  const sessionId = params.session_id

  const order = sessionId ? await getStripeSessionStatus(sessionId).catch(() => null) : null

  return (
    <main>
      <section className="page-section">
        <div className="container order-status-grid">
          <article className="form-card">
            <p className="eyebrow">Stripe Checkout</p>
            <h1 className="page-title">Payment confirmation received.</h1>
            <p className="section-copy">
              {order
                ? `Order #${order.id} is ${order.status}. Refresh the page if Stripe is still finalizing confirmation.`
                : "We could not confirm the Stripe session yet. Please return to your order tracking page or try again shortly."}
            </p>

            {order ? (
              <div className="admin-order-summary">
                <p><strong>Total:</strong> {formatKes(order.total_amount)}</p>
                <p><strong>Paid:</strong> {formatKes(order.amount_paid)}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
            ) : null}

            <div className="hero-actions">
              {order ? (
                <Link href={`/orders/${order.download_token}`} className="button button-secondary">
                  View order status
                </Link>
              ) : null}
              {order?.can_download ? (
                <a className="button" href={buildApiUrl(`/api/download/${order.download_token}`)}>
                  Download drawing pack
                </a>
              ) : null}
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
