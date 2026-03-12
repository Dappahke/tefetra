import {
  createAddOnAction,
  deleteAddOnAction,
  updateAddOnAction,
} from "@/app/admin/actions"
import { formatKes } from "@/lib/api"
import { getAdminAddOns } from "@/lib/admin-api"

export default async function AdminAddOnsPage() {
  const addOns = await getAdminAddOns()

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">Technical Add-ons</p>
          <h2 className="page-title">Manage additional drawing and support packages.</h2>
        </div>
      </div>

      <section className="form-card">
        <div className="form-intro">
          <p className="eyebrow">New Add-on</p>
          <h3 className="section-title-display">Create a technical service upsell.</h3>
        </div>
        <form action={createAddOnAction} className="admin-form-grid">
          <label className="field">
            <span className="field-label">Name</span>
            <input className="text-input" type="text" name="name" required />
          </label>
          <label className="field">
            <span className="field-label">Slug</span>
            <input className="text-input" type="text" name="slug" required />
          </label>
          <label className="field field-full">
            <span className="field-label">Description</span>
            <textarea className="text-area" name="description" />
          </label>
          <label className="field">
            <span className="field-label">Price (KES)</span>
            <input className="text-input" type="number" min="0" step="0.01" name="price" required />
          </label>
          <label className="field checkbox-field">
            <input type="checkbox" name="is_active" value="1" defaultChecked />
            <span>Active in checkout</span>
          </label>
          <div className="field-full">
            <button className="button" type="submit">Create add-on</button>
          </div>
        </form>
      </section>

      <div className="admin-card-grid">
        {addOns.map((addOn) => (
          <article key={addOn.id} className="content-card admin-edit-card">
            <div className="admin-card-head">
              <div>
                <h3>{addOn.name}</h3>
                <p className="plan-meta">{formatKes(addOn.price)} - {addOn.is_active ? "Active" : "Inactive"}</p>
              </div>
            </div>
            <form action={updateAddOnAction} className="admin-form-grid">
              <input type="hidden" name="add_on_id" value={addOn.id} />
              <label className="field">
                <span className="field-label">Name</span>
                <input className="text-input" type="text" name="name" defaultValue={addOn.name} required />
              </label>
              <label className="field">
                <span className="field-label">Slug</span>
                <input className="text-input" type="text" name="slug" defaultValue={addOn.slug} required />
              </label>
              <label className="field field-full">
                <span className="field-label">Description</span>
                <textarea className="text-area" name="description" defaultValue={addOn.description ?? ""} />
              </label>
              <label className="field">
                <span className="field-label">Price (KES)</span>
                <input className="text-input" type="number" min="0" step="0.01" name="price" defaultValue={addOn.price} required />
              </label>
              <label className="field checkbox-field">
                <input type="checkbox" name="is_active" value="1" defaultChecked={addOn.is_active} />
                <span>Available in checkout</span>
              </label>
              <div className="field-full admin-card-actions">
                <button className="button" type="submit">Save add-on</button>
              </div>
            </form>
            <form action={deleteAddOnAction}>
              <input type="hidden" name="add_on_id" value={addOn.id} />
              <button className="button button-ghost" type="submit">Delete add-on</button>
            </form>
          </article>
        ))}
      </div>
    </div>
  )
}
