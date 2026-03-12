import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/app/admin/actions"
import { buildStorageUrl, formatKes } from "@/lib/api"
import { getAdminProducts } from "@/lib/admin-api"

export default async function AdminProductsPage() {
  const products = await getAdminProducts()

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">Products</p>
          <h2 className="page-title">Upload and manage plan listings.</h2>
        </div>
      </div>

      <section className="form-card">
        <div className="form-intro">
          <p className="eyebrow">New Product</p>
          <h3 className="section-title-display">Add a ready-made plan.</h3>
        </div>

        <form action={createProductAction} className="admin-form-grid">
          <label className="field">
            <span className="field-label">Title</span>
            <input className="text-input" type="text" name="title" required />
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
          <label className="field">
            <span className="field-label">Bedrooms</span>
            <input className="text-input" type="number" min="0" name="bedrooms" required />
          </label>
          <label className="field">
            <span className="field-label">Bathrooms</span>
            <input className="text-input" type="number" min="0" name="bathrooms" required />
          </label>
          <label className="field">
            <span className="field-label">Area (sqm)</span>
            <input className="text-input" type="number" min="0" name="area_sqm" required />
          </label>
          <label className="field">
            <span className="field-label">Preview image</span>
            <input className="text-input" type="file" accept="image/*" name="preview_image" />
          </label>
          <label className="field">
            <span className="field-label">Plan PDF</span>
            <input className="text-input" type="file" accept="application/pdf" name="plan_file" required />
          </label>
          <div className="field-full">
            <button className="button" type="submit">Create product</button>
          </div>
        </form>
      </section>

      <div className="admin-card-grid">
        {products.map((product) => (
          <article key={product.id} className="content-card admin-edit-card">
            <div className="admin-card-head">
              <div>
                <h3>{product.title}</h3>
                <p className="plan-meta">{formatKes(product.price)} - {product.area_sqm} sqm</p>
              </div>
              {product.preview_image ? (
                <a href={buildStorageUrl(product.preview_image) ?? "#"} className="service-link">
                  Preview image
                </a>
              ) : null}
            </div>

            <form action={updateProductAction} className="admin-form-grid">
              <input type="hidden" name="product_id" value={product.id} />
              <label className="field">
                <span className="field-label">Title</span>
                <input className="text-input" type="text" name="title" defaultValue={product.title} required />
              </label>
              <label className="field">
                <span className="field-label">Slug</span>
                <input className="text-input" type="text" name="slug" defaultValue={product.slug} required />
              </label>
              <label className="field field-full">
                <span className="field-label">Description</span>
                <textarea className="text-area" name="description" defaultValue={product.description ?? ""} />
              </label>
              <label className="field">
                <span className="field-label">Price (KES)</span>
                <input className="text-input" type="number" min="0" step="0.01" name="price" defaultValue={product.price} required />
              </label>
              <label className="field">
                <span className="field-label">Bedrooms</span>
                <input className="text-input" type="number" min="0" name="bedrooms" defaultValue={product.bedrooms} required />
              </label>
              <label className="field">
                <span className="field-label">Bathrooms</span>
                <input className="text-input" type="number" min="0" name="bathrooms" defaultValue={product.bathrooms} required />
              </label>
              <label className="field">
                <span className="field-label">Area (sqm)</span>
                <input className="text-input" type="number" min="0" name="area_sqm" defaultValue={product.area_sqm} required />
              </label>
              <label className="field">
                <span className="field-label">Replace preview image</span>
                <input className="text-input" type="file" accept="image/*" name="preview_image" />
              </label>
              <label className="field">
                <span className="field-label">Replace plan PDF</span>
                <input className="text-input" type="file" accept="application/pdf" name="plan_file" />
              </label>
              <div className="field-full admin-card-actions">
                <button className="button" type="submit">Save changes</button>
              </div>
            </form>

            <form action={deleteProductAction}>
              <input type="hidden" name="product_id" value={product.id} />
              <button className="button button-ghost" type="submit">Delete product</button>
            </form>
          </article>
        ))}
      </div>
    </div>
  )
}
