import Image from "next/image"
import Link from "next/link"

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/plans", label: "Plans" },
  { href: "/studio-build", label: "Studio + Build" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/sustainability", label: "Sustainability" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact + Consultation" },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-block">
          <div className="footer-brand-row">
            <Image
              src="/logo.png"
              alt="Tefetro Studios logo"
              width={64}
              height={64}
              className="footer-logo"
            />
            <div>
              <p className="eyebrow">TEFETRO STUDIOS</p>
              <h2 className="footer-title">Digital architecture for clients building in Kenya from anywhere.</h2>
            </div>
          </div>
          <p className="footer-copy">
            Architecture studio website, plan marketplace, and consultation platform built for remote collaboration.
          </p>
        </div>

        <div>
          <p className="footer-heading">Navigate</p>
          <div className="footer-links">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="footer-heading">Core services</p>
          <div className="footer-links footer-links-muted">
            <span>Ready-made house plans</span>
            <span>Architecture and construction strategy</span>
            <span>Technical add-ons</span>
            <span>Remote supervision</span>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>TEFETRO STUDIOS</p>
        <p>Digital Architecture Platform for diaspora and local clients.</p>
      </div>
    </footer>
  )
}
