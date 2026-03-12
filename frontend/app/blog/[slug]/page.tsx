import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { blogPosts, getBlogPost } from "@/lib/blog"

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return {
      title: "Article not found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <main>
      <section className="page-hero article-hero-section">
        <div className="container article-hero-grid">
          <div>
            <p className="eyebrow">{post.category}</p>
            <h1 className="page-title">{post.title}</h1>
            <p className="page-copy">{post.excerpt}</p>
            <div className="blog-meta blog-meta-large">
              <span>{post.publishedAt}</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container article-layout">
          <article className="content-card article-prose">
            {post.sections.map((section) => (
              <section key={section.heading} className="article-section-block">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </article>

          <aside className="content-card article-aside">
            <p className="eyebrow">Next step</p>
            <h2 className="section-title-mini">Turn research into a project brief.</h2>
            <p className="section-copy">If the article answers part of the question but your site, budget, or program needs project-specific advice, move into the consultation workflow.</p>
            <div className="hero-actions article-actions">
              <Link href="/contact" className="button">Start project</Link>
              <Link href="/plans" className="button button-secondary">Browse plans</Link>
              <Link href="/blog" className="button button-ghost">Back to blog</Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
