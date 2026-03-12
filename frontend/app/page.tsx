export const dynamic = "force-dynamic"

import Link from "next/link"
import ProductCard from "@/components/ProductCard"
import SectionIntro from "@/components/SectionIntro"
import { getFeaturedBlogPosts } from "@/lib/blog"
import { getFeaturedProducts } from "@/lib/catalog"
import { Product } from "@/types/product"
import {
  heroMetrics,
  processSteps,
  serviceCards,
  sustainabilityPrinciples,
} from "@/lib/site-content"

export default async function Home() {
  let featuredPlans: Product[] = []
  let errorMessage = ""
  const featuredArticles = getFeaturedBlogPosts(3)

  try {
    featuredPlans = await getFeaturedProducts(6)
  } catch (error) {
    console.error("Failed to fetch featured plans", error)
    errorMessage = "Unable to load the plan marketplace right now."
  }

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy-block">
            <p className="eyebrow">Digital Architecture Platform</p>
            <h1 className="hero-title">Design your home from anywhere in the world.</h1>
            <p className="hero-text">TEFETRO STUDIOS combines architectural design services, a ready-made house plan marketplace, construction support, and a remote-first workflow built for diaspora clients.</p>
            <div className="hero-actions">
              <Link href="/plans" className="button">Browse Plans</Link>
              <Link href="/contact" className="button button-secondary">Start a Project</Link>
            </div>
            <div className="metric-grid">
              {heroMetrics.map((item) => (
                <article key={item.label} className="metric-card">
                  <p className="metric-label">{item.label}</p>
                  <p className="metric-value">{item.value}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-board">
              <div className="hero-board-panel hero-board-panel-primary">
                <p className="hero-board-label">Tefetro workflow</p>
                <h2>Studio website + plan marketplace + consultation funnel</h2>
              </div>
              <div className="hero-board-row">
                <article className="hero-board-panel hero-board-panel-secondary">
                  <p className="hero-board-label">Tier 1</p>
                  <strong>Ready-made plans</strong>
                  <span>Instant digital delivery</span>
                </article>
                <article className="hero-board-panel hero-board-panel-accent">
                  <p className="hero-board-label">Tier 2</p>
                  <strong>Technical add-ons</strong>
                  <span>BOQ, structural, interiors</span>
                </article>
              </div>
              <article className="hero-board-panel hero-board-panel-note">
                <p className="hero-board-label">Tier 3</p>
                <strong>Professional services</strong>
                <span>Custom design, supervision, project management</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionIntro eyebrow="Services" title="A digital architecture firm structured around three revenue streams." description="The platform supports digital products, technical drawing add-ons, and high-value professional services for design and construction delivery." />
          <div className="service-grid">
            {serviceCards.map((service) => (
              <article key={service.title} className="service-card">
                <p className="eyebrow">{service.eyebrow}</p>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link href={service.href} className="service-link">{service.linkLabel}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="page-section band-section">
        <div className="container">
          <SectionIntro eyebrow="Featured Plans" title="Downloadable architectural plans for modern African living." description="Each plan is positioned as a digital product with optional technical add-ons and a clear next step into construction support.">
            <div className="section-intro-actions">
              <Link href="/plans" className="button button-secondary">View all plans</Link>
            </div>
          </SectionIntro>
          {errorMessage ? <p className="status-error">{errorMessage}</p> : null}
          {featuredPlans.length > 0 ? (
            <div className="plan-grid">
              {featuredPlans.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Plan catalog coming online</h3>
              <p>Upload plans in the Laravel backend and they will appear here in the marketplace.</p>
            </div>
          )}
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionIntro eyebrow="How It Works" title="A clear remote process for diaspora and local clients." description="The public site acts as the front office of the firm, guiding clients from discovery to drawings to construction support." align="center" />
          <div className="process-grid">
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

      <section className="page-section sustainability-panel-section">
        <div className="container split-callout">
          <div>
            <p className="eyebrow">Sustainability</p>
            <h2 className="section-title-display">Climate responsive architecture is part of the studio identity.</h2>
            <p className="section-copy">TEFETRO STUDIOS prioritizes passive cooling, natural ventilation, daylight optimization, and design choices that respond to African climates rather than generic imported planning models.</p>
            <Link href="/sustainability" className="button button-secondary">Explore the sustainability approach</Link>
          </div>
          <div className="detail-grid">
            {sustainabilityPrinciples.map((principle) => (
              <article key={principle.title} className="detail-card">
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionIntro eyebrow="Blog" title="An SEO content engine built around real diaspora building questions." description="Educational articles build authority before the first enquiry and give the platform a compounding acquisition channel beyond paid traffic.">
            <div className="section-intro-actions">
              <Link href="/blog" className="button button-secondary">View all articles</Link>
            </div>
          </SectionIntro>
          <div className="blog-grid">
            {featuredArticles.map((post) => (
              <article key={post.slug} className="content-card blog-card">
                <p className="eyebrow">{post.category}</p>
                <h3 className="blog-title">{post.title}</h3>
                <div className="blog-meta">
                  <span>{post.publishedAt}</span>
                  <span>{post.readTime}</span>
                </div>
                <p className="section-copy">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="service-link">Read article</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section final-cta-section">
        <div className="container cta-panel">
          <p className="eyebrow">Start a Project</p>
          <h2 className="section-title-display">Buy a plan, request a custom design, or talk to the studio about supervision.</h2>
          <p className="section-copy">The platform is designed to convert plan buyers, consultation leads, and construction clients inside one digital experience.</p>
          <div className="hero-actions hero-actions-centered">
            <Link href="/plans" className="button">Browse Plans</Link>
            <Link href="/contact" className="button button-secondary">Start Project</Link>
          </div>
        </div>
      </section>
    </>
  )
}
