import Link from "next/link"

export default function NotFound() {
  return (
    <main className="page-section">
      <div className="container cta-panel">
        <p className="eyebrow">Not Found</p>
        <h1 className="section-title-display">That page is not part of the Tefetro platform.</h1>
        <p className="section-copy">Return to the marketplace or submit a consultation request for help with a specific project.</p>
        <div className="hero-actions hero-actions-centered">
          <Link href="/plans" className="button">Browse plans</Link>
          <Link href="/consultation-request" className="button button-secondary">Request consultation</Link>
        </div>
      </div>
    </main>
  )
}
