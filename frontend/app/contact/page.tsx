import ConsultationForm from "@/components/ConsultationForm"
import SectionIntro from "@/components/SectionIntro"

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Contact + Consultation</p>
            <h1 className="page-title">Start the conversation and submit your project brief in one place.</h1>
            <p className="page-copy">This page combines direct contact with the consultation workflow, so the studio receives useful project information from the start instead of a generic message with no context.</p>
          </div>
          <div className="hero-mini-card">
            <p className="hero-board-label">Best use of this page</p>
            <strong>Lead capture with project context.</strong>
            <span>Budget, site, timeline, and scope are more useful than a plain email request.</span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container split-callout split-callout-top">
          <div>
            <SectionIntro eyebrow="Before you submit" title="The stronger the brief, the stronger the first response." description="Share the site location, plot size, budget, and intended timeline so the team can quickly tell whether the project fits a ready-made plan, a technical add-on, or a full consultation." />
            <div className="detail-grid compact-detail-grid">
              <article className="detail-card">
                <h3>Diaspora clients</h3>
                <p>Use the form to explain where you live and how you want project communication managed.</p>
              </article>
              <article className="detail-card">
                <h3>Local clients</h3>
                <p>Use the same flow if you need a ready-made plan, custom design, or supervision support within Kenya.</p>
              </article>
            </div>
          </div>
          <ConsultationForm defaultServiceType="Custom architectural design" title="Start a project conversation" description="Use one form for first contact, design consultation, or construction support so the team can respond with the right next step." />
        </div>
      </section>
    </main>
  )
}
