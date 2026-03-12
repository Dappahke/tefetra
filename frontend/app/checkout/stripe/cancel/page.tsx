import Link from "next/link"

type StripeCancelPageProps = {
  searchParams: Promise<{
    order?: string
  }>
}

export default async function StripeCancelPage({ searchParams }: StripeCancelPageProps) {
  const params = await searchParams

  return (
    <main>
      <section className="page-section">
        <div className="container order-status-grid">
          <article className="form-card">
            <p className="eyebrow">Stripe Checkout</p>
            <h1 className="page-title">Payment was not completed.</h1>
            <p className="section-copy">
              Your plan selection has not been lost. You can return to the product page and restart checkout, or review the pending order status below.
            </p>
            <div className="hero-actions">
              {params.order ? (
                <Link href={`/orders/${params.order}`} className="button">
                  View pending order
                </Link>
              ) : null}
              <Link href="/plans" className="button button-secondary">
                Back to plans
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
