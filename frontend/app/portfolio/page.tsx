import Link from "next/link"
import SectionIntro from "@/components/SectionIntro"
import { portfolioProjects } from "@/lib/site-content"

export default function PortfolioPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h1 className="page-title">Project stories that reinforce architectural credibility.</h1>
            <p className="page-copy">The portfolio page showcases the kinds of residential and development work the studio can deliver for private clients, investors, and diaspora families.</p>
          </div>
          <div className="hero-mini-card">
            <p className="hero-board-label">Portfolio role</p>
            <strong>Build trust before the consultation.</strong>
            <span>Strong case studies help clients understand the design language and delivery mindset.</span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionIntro eyebrow="Selected Work" title="A portfolio mix that supports both plan buyers and full-service clients." description="These cards are placeholders for future project case studies, imagery, and outcome details." />
          <div className="portfolio-grid">
            {portfolioProjects.map((project) => (
              <article key={project.title} className="portfolio-card">
                <p className="eyebrow">{project.type}</p>
                <h3>{project.title}</h3>
                <p className="portfolio-meta">{project.location}</p>
                <p>{project.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section">
        <div className="container cta-panel">
          <p className="eyebrow">Build with us</p>
          <h2 className="section-title-display">If your project needs similar thinking, start with a consultation.</h2>
          <div className="hero-actions hero-actions-centered">
            <Link href="/consultation-request" className="button">Start consultation</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
