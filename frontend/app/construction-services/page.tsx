import Link from "next/link"
import SectionIntro from "@/components/SectionIntro"
import { constructionOfferings, processSteps } from "@/lib/site-content"

export default function ConstructionServicesPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Construction Services</p>
            <h1 className="page-title">Project supervision for clients who need visibility from abroad.</h1>
            <p className="page-copy">Construction support is positioned as a professional service for clients who want design quality protected during execution and a clearer reporting structure while away from site.</p>
          </div>
          <div className="hero-mini-card">
            <p className="hero-board-label">Primary outcome</p>
            <strong>Build trust with diaspora clients.</strong>
            <span>Transparency, reporting cadence, and milestone oversight matter as much as technical skill.</span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionIntro eyebrow="Offerings" title="Construction support services that sit beyond the plan purchase." description="These are higher-value engagements designed to convert consultation requests into project relationships." />
          <div className="detail-grid detail-grid-wide">
            {constructionOfferings.map((item) => (
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
          <div>
            <SectionIntro eyebrow="Remote Process" title="The construction workflow should remain legible to the client at every stage." description="The platform is built around structured checkpoints so a client in the USA, UK, or Middle East can still understand progress and decisions." />
          </div>
          <div className="process-grid compact-process-grid">
            {processSteps.map((item) => (
              <article key={item.step} className="process-card">
                <p className="process-step">{item.step}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section">
        <div className="container cta-panel">
          <p className="eyebrow">Construction Inquiry</p>
          <h2 className="section-title-display">Talk to the studio about supervision or project management.</h2>
          <div className="hero-actions hero-actions-centered">
            <Link href="/consultation-request" className="button">Request construction consultation</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
