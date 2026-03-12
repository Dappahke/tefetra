import type { Metadata } from "next"
import Link from "next/link"
import SectionIntro from "@/components/SectionIntro"
import { blogPosts } from "@/lib/blog"
import { seoTopics } from "@/lib/site-content"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles from Tefetro Studios about building in Kenya from abroad, architectural planning, sustainability, and construction strategy.",
}

export default function BlogPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Blog</p>
            <h1 className="page-title">Educational content built for diaspora trust and organic discovery.</h1>
            <p className="page-copy">The blog answers the questions that clients ask before they are ready to submit a brief: budgeting, planning, building from abroad, and climate-responsive design in East Africa.</p>
          </div>
          <div className="hero-mini-card">
            <p className="hero-board-label">SEO objective</p>
            <strong>Publish helpful architecture content that earns attention before the first enquiry.</strong>
            <span>Each article should answer a practical client question and move the reader toward a plan purchase or consultation.</span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionIntro eyebrow="Latest Articles" title="Articles for plan buyers, custom design clients, and remote builders." description="This section turns search intent into trust by explaining how architecture and construction decisions actually work in the Kenyan context." />
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article key={post.slug} className="content-card blog-card">
                <p className="eyebrow">{post.category}</p>
                <h2 className="blog-title">{post.title}</h2>
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

      <section className="page-section band-section final-cta-section">
        <div className="container">
          <SectionIntro eyebrow="Search Themes" title="Core SEO topics that support the firm's long-term growth." description="These are the subjects that help Tefetro Studios get discovered by the right audience and demonstrate authority early in the funnel." align="center" />
          <div className="tag-row blog-topic-row">
            {seoTopics.map((topic) => (
              <span key={topic} className="tag tag-solid-muted">{topic}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
