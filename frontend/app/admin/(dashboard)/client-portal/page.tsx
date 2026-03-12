import {
  createClientProjectAction,
  createProjectUpdateAction,
  deleteClientProjectAction,
  deleteProjectUpdateAction,
  updateClientProjectAction,
  updateProjectUpdateAction,
} from "@/app/admin/actions"
import { getAdminClientProjects } from "@/lib/admin-api"

export default async function AdminClientPortalPage() {
  const clientProjects = await getAdminClientProjects()

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">Client Portal</p>
          <h2 className="page-title">Publish progress updates for remote clients.</h2>
        </div>
      </div>

      <section className="form-card">
        <div className="form-intro">
          <p className="eyebrow">New Client Project</p>
          <h3 className="section-title-display">Create a portal-ready project.</h3>
        </div>

        <form action={createClientProjectAction} className="admin-form-grid">
          <label className="field">
            <span className="field-label">Client name</span>
            <input className="text-input" type="text" name="client_name" required />
          </label>
          <label className="field">
            <span className="field-label">Client email</span>
            <input className="text-input" type="email" name="client_email" required />
          </label>
          <label className="field">
            <span className="field-label">Project title</span>
            <input className="text-input" type="text" name="title" required />
          </label>
          <label className="field">
            <span className="field-label">Location</span>
            <input className="text-input" type="text" name="location" required />
          </label>
          <label className="field">
            <span className="field-label">Status</span>
            <input className="text-input" type="text" name="status" defaultValue="planning" required />
          </label>
          <label className="field">
            <span className="field-label">Cover image</span>
            <input className="text-input" type="file" accept="image/*" name="cover_image" />
          </label>
          <label className="field field-full">
            <span className="field-label">Summary</span>
            <textarea className="text-area" name="summary" />
          </label>
          <div className="field-full">
            <button className="button" type="submit">Create client project</button>
          </div>
        </form>
      </section>

      <div className="admin-card-grid client-project-grid">
        {clientProjects.map((project) => (
          <article key={project.id} className="content-card admin-edit-card admin-project-card">
            <div className="admin-card-head">
              <div>
                <h3>{project.title}</h3>
                <p className="plan-meta">{project.client_name} - {project.location}</p>
              </div>
              <a href={`/client-portal/${project.portal_token}`} className="service-link" target="_blank" rel="noreferrer">
                Open portal
              </a>
            </div>

            <form action={updateClientProjectAction} className="admin-form-grid">
              <input type="hidden" name="project_id" value={project.id} />
              <label className="field">
                <span className="field-label">Client name</span>
                <input className="text-input" type="text" name="client_name" defaultValue={project.client_name} required />
              </label>
              <label className="field">
                <span className="field-label">Client email</span>
                <input className="text-input" type="email" name="client_email" defaultValue={project.client_email} required />
              </label>
              <label className="field">
                <span className="field-label">Project title</span>
                <input className="text-input" type="text" name="title" defaultValue={project.title} required />
              </label>
              <label className="field">
                <span className="field-label">Location</span>
                <input className="text-input" type="text" name="location" defaultValue={project.location} required />
              </label>
              <label className="field">
                <span className="field-label">Status</span>
                <input className="text-input" type="text" name="status" defaultValue={project.status} required />
              </label>
              <label className="field">
                <span className="field-label">Replace cover image</span>
                <input className="text-input" type="file" accept="image/*" name="cover_image" />
              </label>
              <label className="field field-full">
                <span className="field-label">Summary</span>
                <textarea className="text-area" name="summary" defaultValue={project.summary ?? ""} />
              </label>
              <div className="field-full admin-card-actions">
                <button className="button" type="submit">Save project</button>
              </div>
            </form>

            <form action={deleteClientProjectAction}>
              <input type="hidden" name="project_id" value={project.id} />
              <button className="button button-ghost" type="submit">Delete project</button>
            </form>

            <div className="admin-update-stack">
              <div className="admin-panel-head">
                <h4>Publish a new update</h4>
              </div>
              <form action={createProjectUpdateAction} className="admin-form-grid">
                <input type="hidden" name="project_id" value={project.id} />
                <label className="field">
                  <span className="field-label">Update title</span>
                  <input className="text-input" type="text" name="title" required />
                </label>
                <label className="field">
                  <span className="field-label">Milestone</span>
                  <input className="text-input" type="text" name="milestone" />
                </label>
                <label className="field">
                  <span className="field-label">Publish at</span>
                  <input className="text-input" type="datetime-local" name="published_at" />
                </label>
                <label className="field">
                  <span className="field-label">Photo</span>
                  <input className="text-input" type="file" accept="image/*" name="photo" />
                </label>
                <label className="field field-full">
                  <span className="field-label">Update body</span>
                  <textarea className="text-area" name="body" required />
                </label>
                <div className="field-full admin-card-actions">
                  <button className="button" type="submit">Publish update</button>
                </div>
              </form>
            </div>

            <div className="admin-update-stack">
              {project.project_updates.map((update) => (
                <article key={update.id} className="detail-card admin-update-card">
                  <form action={updateProjectUpdateAction} className="admin-form-grid">
                    <input type="hidden" name="project_update_id" value={update.id} />
                    <label className="field">
                      <span className="field-label">Title</span>
                      <input className="text-input" type="text" name="title" defaultValue={update.title} required />
                    </label>
                    <label className="field">
                      <span className="field-label">Milestone</span>
                      <input className="text-input" type="text" name="milestone" defaultValue={update.milestone ?? ""} />
                    </label>
                    <label className="field">
                      <span className="field-label">Publish at</span>
                      <input className="text-input" type="datetime-local" name="published_at" defaultValue={update.published_at ? update.published_at.slice(0, 16) : ""} />
                    </label>
                    <label className="field">
                      <span className="field-label">Replace photo</span>
                      <input className="text-input" type="file" accept="image/*" name="photo" />
                    </label>
                    <label className="field field-full">
                      <span className="field-label">Body</span>
                      <textarea className="text-area" name="body" defaultValue={update.body} required />
                    </label>
                    <div className="field-full admin-card-actions">
                      <button className="button" type="submit">Save update</button>
                    </div>
                  </form>
                  <form action={deleteProjectUpdateAction}>
                    <input type="hidden" name="project_update_id" value={update.id} />
                    <button className="button button-ghost" type="submit">Delete update</button>
                  </form>
                </article>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
