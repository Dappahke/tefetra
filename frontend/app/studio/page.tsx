import Link from "next/link"
import SectionIntro from "@/components/SectionIntro"
import { processSteps, seoTopics, studioPillars } from "@/lib/site-content"

export default function StudioPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Studio</p>
            <h1 className="page-title">A digital architecture studio built for remote trust.</h1>
            <p className="page-copy">TEFETRO STUDIOS is designed to serve diaspora and local clients who need architectural expertise, strong communication, and a cleaner path from design into construction.</p>
          </div>
          <div className="hero-mini-card">
            <p className="hero-board-label">Studio focus</p>
            <strong>Architecture, technical depth, and remote collaboration.</strong>
            <span>The platform acts as the digital front office of the practice.</span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionIntro eyebrow="Core Pillars" title="The studio sits at the intersection of architecture, delivery, and transparency." description="Its role is not just to draw houses, but to give remote clients confidence in decisions made from abroad." />
          <div className="detail-grid detail-grid-wide">
            {studioPillars.map((pillar) => (
              <article key={pillar.title} className="detail-card">
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section band-section">
        <div className="container split-callout">
          <div>
            <SectionIntro eyebrow="Workflow" title="A studio model designed for digital lead generation and service conversion." description="Ready-made plans drive product sales, while consultations open the door to custom design, construction supervision, and project management." />
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

      <section className="page-section">
        <div className="container">
          <SectionIntro eyebrow="Content Strategy" title="The studio can also publish educational content to attract organic leads." description="This gives the platform a long-term acquisition channel beyond paid traffic and referrals." />
          <div className="tag-row">
            {seoTopics.map((topic) => (
              <span key={topic} className="tag tag-solid-muted">{topic}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section">
        <div className="container cta-panel">
          <p className="eyebrow">Next Step</p>
          <h2 className="section-title-display">Discuss a new home, apartment block, or construction brief.</h2>
          <div className="hero-actions hero-actions-centered">
            <Link href="/consultation-request" className="button">Start consultation</Link>
            <Link href="/plans" className="button button-secondary">Browse plans</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
