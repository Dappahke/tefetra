import { updateConsultationAction } from "@/app/admin/actions"
import { getAdminConsultations } from "@/lib/admin-api"

const statusOptions = ["new", "contacted", "qualified", "closed"]

export default async function AdminConsultationsPage() {
  const consultations = await getAdminConsultations()

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">Consultations</p>
          <h2 className="page-title">Capture and qualify high-value project leads.</h2>
        </div>
      </div>

      <div className="admin-card-grid">
        {consultations.map((consultation) => (
          <article key={consultation.id} className="content-card admin-edit-card">
            <div className="admin-card-head">
              <div>
                <h3>{consultation.name}</h3>
                <p className="plan-meta">{consultation.email} - {consultation.country}</p>
              </div>
              <span className={`status-pill status-pill-${consultation.status}`}>{consultation.status}</span>
            </div>

            <div className="admin-order-summary">
              <p><strong>Plot location:</strong> {consultation.plot_location}</p>
              <p><strong>Plot size:</strong> {consultation.plot_size}</p>
              <p><strong>Budget:</strong> {consultation.budget_range}</p>
              <p><strong>Timeline:</strong> {consultation.project_timeline}</p>
              <p><strong>Service:</strong> {consultation.service_type ?? "Not specified"}</p>
            </div>

            <p className="section-copy">{consultation.description}</p>

            <form action={updateConsultationAction} className="admin-form-grid compact-grid">
              <input type="hidden" name="consultation_id" value={consultation.id} />
              <label className="field">
                <span className="field-label">Status</span>
                <select className="select-input" name="status" defaultValue={consultation.status}>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
              <div className="field-full admin-card-actions">
                <button className="button" type="submit">Update consultation</button>
              </div>
            </form>
          </article>
        ))}
      </div>
    </div>
  )
}
