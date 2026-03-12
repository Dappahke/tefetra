export const dynamic = "force-dynamic"

import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { buildStorageUrl } from "@/lib/api"
import { getClientProject } from "@/lib/catalog"

type ClientPortalPageProps = {
  params: Promise<{ token: string }>
}

export default async function ClientPortalPage({ params }: ClientPortalPageProps) {
  const { token } = await params
  const project = await getClientProject(token).catch(() => null)

  if (!project) {
    notFound()
  }

  const coverImage = buildStorageUrl(project.cover_image)

  return (
    <main>
      <section className="page-section">
        <div className="container client-portal-layout">
          <div className="client-portal-hero">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={project.title}
                width={1400}
                height={900}
                className="product-image"
              />
            ) : null}
            <div className="content-card client-portal-summary">
              <p className="eyebrow">Client Portal</p>
              <h1 className="page-title">{project.title}</h1>
              <p className="page-copy">{project.summary ?? "Remote project monitoring for your TEFETRO build."}</p>
              <div className="tag-row">
                <span className="tag">{project.status}</span>
                <span className="tag">{project.location}</span>
              </div>
            </div>
          </div>

          <div className="timeline-stack">
            {project.project_updates.length > 0 ? (
              project.project_updates.map((update) => {
                const photoUrl = buildStorageUrl(update.photo_url)

                return (
                  <article key={update.id} className="detail-card timeline-card">
                    <div className="timeline-card-head">
                      <div>
                        <p className="eyebrow">{update.milestone ?? "Project update"}</p>
                        <h2 className="section-title-mini">{update.title}</h2>
                      </div>
                      <span className="plan-meta">
                        {update.published_at
                          ? new Date(update.published_at).toLocaleDateString("en-KE", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Draft"}
                      </span>
                    </div>
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={update.title}
                        width={1200}
                        height={800}
                        className="plan-image client-portal-image"
                      />
                    ) : null}
                    <p className="section-copy">{update.body}</p>
                  </article>
                )
              })
            ) : (
              <div className="empty-state">
                <h2>No progress updates have been published yet.</h2>
                <p>The studio will post milestones here as work progresses.</p>
              </div>
            )}
          </div>

          <div className="hero-actions">
            <Link href="/consultation-request" className="button">Contact the studio</Link>
            <Link href="/plans" className="button button-secondary">Browse plans</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
