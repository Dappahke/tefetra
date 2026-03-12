export const dynamic = "force-dynamic"

import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import ProductPurchasePanel from "@/components/ProductPurchasePanel"
import SectionIntro from "@/components/SectionIntro"
import { buildStorageUrl } from "@/lib/api"
import { getAddOns, getProduct } from "@/lib/catalog"

type ProductPageProps = {
  params: Promise<{ id: string }>
}

const deliverables = [
  "Digital architectural drawing pack",
  "Download token generated per order",
  "Optional technical add-ons at checkout",
  "Direct path into custom consultation or supervision services",
]

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id).catch(() => null)

  if (!product) {
    notFound()
  }

  const addOns = await getAddOns().catch(() => [])
  const availableAddOns = addOns.filter((item) => item.is_active)
  const previewUrl = buildStorageUrl(product.preview_image)

  return (
    <main>
      <section className="page-section product-page-section">
        <div className="container product-layout">
          <div>
            {previewUrl ? (
              <Image className="plan-image product-image" src={previewUrl} alt={product.title} width={1400} height={1000} />
            ) : (
              <div className="plan-image plan-image-fallback product-image">Preview coming soon</div>
            )}
          </div>

          <div className="product-aside">
            <p className="eyebrow">Single Plan Page</p>
            <h1 className="page-title">{product.title}</h1>
            <div className="plan-spec-row plan-spec-row-large">
              <span>{product.bedrooms} bedrooms</span>
              <span>{product.bathrooms} bathrooms</span>
              <span>{product.area_sqm} sqm</span>
            </div>
            <p className="product-description">{product.description || "A build-ready plan created for modern African living."}</p>

            <div className="content-card compact-card">
              <h2 className="section-title-mini">What the plan page is designed to do</h2>
              <ul className="checklist">
                {deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <ProductPurchasePanel product={product} availableAddOns={availableAddOns} />
          </div>
        </div>
      </section>

      <section className="page-section band-section">
        <div className="container split-callout">
          <div>
            <SectionIntro eyebrow="Need more than a plan?" title="Move from a digital product into a full project scope." description="The same plan can evolve into a larger studio engagement when the client needs site adaptation, technical add-ons, or construction guidance." />
          </div>
          <div className="detail-grid">
            <article className="detail-card">
              <h3>Site adaptation</h3>
              <p>Adjust a ready-made plan to suit plot dimensions, orientation, and local authority considerations.</p>
            </article>
            <article className="detail-card">
              <h3>Technical documentation</h3>
              <p>Bundle structural drawings, BOQs, interiors, or smart-home planning when the project needs more depth.</p>
            </article>
            <article className="detail-card">
              <h3>Construction support</h3>
              <p>Use the consultation route to move into supervision, reporting, and project management services.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section">
        <div className="container cta-panel">
          <p className="eyebrow">Professional Services</p>
          <h2 className="section-title-display">Need a custom version of this design?</h2>
          <p className="section-copy">If the plan is close but not exact, the studio can turn it into a consultation-led project with technical modifications.</p>
          <div className="hero-actions hero-actions-centered">
            <Link href="/consultation-request" className="button">Request a consultation</Link>
            <Link href="/plans" className="button button-secondary">Back to marketplace</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
