import ConsultationForm from "@/components/ConsultationForm"
import SectionIntro from "@/components/SectionIntro"

export default function ConsultationRequestPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Consultation Request</p>
            <h1 className="page-title">Submit a project brief for design, supervision, or sustainability support.</h1>
            <p className="page-copy">This page is the lead engine for high-value services: custom architecture, construction supervision, project management, and technical adaptation work.</p>
          </div>
          <div className="hero-mini-card">
            <p className="hero-board-label">Lead capture objective</p>
            <strong>Turn interest into a qualified brief.</strong>
            <span>Collect location, budget, plot size, and timeline before the first response.</span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container split-callout split-callout-top">
          <div>
            <SectionIntro eyebrow="Prepare your brief" title="Useful details make the consultation more productive." description="The form is structured around the exact inputs the studio needs to judge scope and recommend the right next step." />
            <div className="detail-grid compact-detail-grid">
              <article className="detail-card">
                <h3>Plot information</h3>
                <p>Include location, site size, and any constraints already known on the land.</p>
              </article>
              <article className="detail-card">
                <h3>Budget and timing</h3>
                <p>Budget range and timeline help position the right architectural strategy from day one.</p>
              </article>
              <article className="detail-card">
                <h3>Service need</h3>
                <p>State whether you need a new design, plan adaptation, supervision, or sustainability advice.</p>
              </article>
            </div>
          </div>
          <ConsultationForm />
        </div>
      </section>
    </main>
  )
}
