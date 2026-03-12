import Link from "next/link"
import SectionIntro from "@/components/SectionIntro"
import {
  constructionOfferings,
  processSteps,
  studioPillars,
} from "@/lib/site-content"

export default function StudioBuildPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Studio + Build</p>
            <h1 className="page-title">Architecture strategy and construction support in one workflow.</h1>
            <p className="page-copy">This is the combined view of how TEFETRO STUDIOS moves from design thinking into technical depth, supervision, and clearer reporting for diaspora clients building in Kenya.</p>
          </div>
          <div className="hero-mini-card">
            <p className="hero-board-label">Why this matters</p>
            <strong>The project should stay legible from concept to site delivery.</strong>
            <span>One digital platform should explain design, technical upgrades, and build oversight without fragmenting the client journey.</span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container split-callout">
          <div>
            <SectionIntro eyebrow="Studio Strength" title="Architecture decisions need site realism and remote clarity." description="The studio is structured for clients who want design quality, technical judgment, and better communication while making decisions from abroad." />
          </div>
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
            <SectionIntro eyebrow="Build Support" title="Construction services are part of delivery, not an afterthought." description="Supervision, project management, and reporting are the pieces that help remote clients stay confident once the drawings move onto site." />
          </div>
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

      <section className="page-section">
        <div className="container">
          <SectionIntro eyebrow="Workflow" title="The digital model should stay coherent from plan purchase to supervision." description="Product sales, technical add-ons, and construction services work best when the client understands the path between them." align="center" />
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
          <p className="eyebrow">Explore Deeper</p>
          <h2 className="section-title-display">Need the detailed studio page or the dedicated construction page?</h2>
          <div className="hero-actions hero-actions-centered">
            <Link href="/studio" className="button button-secondary">Architecture studio</Link>
            <Link href="/construction-services" className="button button-secondary">Construction services</Link>
            <Link href="/contact" className="button">Start project</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
