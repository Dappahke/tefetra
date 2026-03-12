import Link from "next/link"
import SectionIntro from "@/components/SectionIntro"
import { sustainabilityPrinciples } from "@/lib/site-content"

export default function SustainabilityPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Sustainability</p>
            <h1 className="page-title">Architecture for tropical climates should work with the environment, not against it.</h1>
            <p className="page-copy">The Tefetro design philosophy emphasizes natural ventilation, passive cooling, daylight control, and climate-responsive planning for healthier, more efficient buildings.</p>
          </div>
          <div className="hero-mini-card">
            <p className="hero-board-label">Design philosophy</p>
            <strong>Climate responsive, practical, and buildable.</strong>
            <span>Good sustainability decisions improve comfort before they become a marketing headline.</span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionIntro eyebrow="Principles" title="Three practical lenses for climate-responsive housing." description="The goal is to create buildings that feel better, perform better, and remain grounded in local environmental realities." />
          <div className="detail-grid detail-grid-wide">
            {sustainabilityPrinciples.map((item) => (
              <article key={item.title} className="detail-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section band-section">
        <div className="container split-callout">
          <div className="content-card">
            <p className="eyebrow">Why it matters</p>
            <h2 className="section-title-display">Sustainability is a trust signal for diaspora clients too.</h2>
            <p className="section-copy">Clients building from abroad want assurance that the final home is comfortable, efficient, and not overdesigned for the climate.</p>
          </div>
          <div className="content-card quote-card">
            <p>Good tropical architecture starts with sun, wind, orientation, and use patterns before it gets to finishes.</p>
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section">
        <div className="container cta-panel">
          <p className="eyebrow">Consultation</p>
          <h2 className="section-title-display">Bring sustainability goals into the earliest project brief.</h2>
          <div className="hero-actions hero-actions-centered">
            <Link href="/consultation-request" className="button">Request sustainability consultation</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
