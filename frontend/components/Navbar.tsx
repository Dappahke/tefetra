"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const navLinks = [
  { href: "/", label: "Home", match: ["/"] },
  { href: "/plans", label: "Plans", match: ["/plans", "/products"] },
  {
    href: "/studio-build",
    label: "Studio + Build",
    match: ["/studio-build", "/studio", "/construction-services"],
  },
  { href: "/portfolio", label: "Portfolio", match: ["/portfolio"] },
  { href: "/sustainability", label: "Sustainability", match: ["/sustainability"] },
  { href: "/blog", label: "Blog", match: ["/blog"] },
] as const

function isActivePath(pathname: string, matches: readonly string[]) {
  return matches.some((match) => {
    if (match === "/") {
      return pathname === match
    }

    return pathname === match || pathname.startsWith(`${match}/`)
  })
}

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const toggleMenu = useCallback(() => setIsOpen((currentValue) => !currentValue), [])
  const closeMenu = useCallback(() => setIsOpen(false), [])

  return (
    <header className={`floating-nav ${isScrolled ? "floating-nav-scrolled" : ""}`}>
      <div className="nav-shell">
        <div className="nav-top-row">
          <Link href="/" className="nav-brand" onClick={closeMenu} aria-label="Tefetro Studios Home">
            <span className="nav-brand-mark nav-brand-mark-image">
              <Image src="/logo.png" alt="" width={48} height={48} className="nav-brand-image" priority />
            </span>
            <span className="nav-brand-text">
              <strong>TEFETRO</strong>
              <small>STUDIOS</small>
            </span>
          </Link>

          <button
            type="button"
            className={`nav-toggle ${isOpen ? "nav-toggle-open" : ""}`}
            aria-expanded={isOpen}
            aria-controls="primary-navigation"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>

        <nav id="primary-navigation" className={`nav-links ${isOpen ? "nav-links-open" : ""}`} aria-label="Primary">
          {navLinks.map((link) => {
            const isActive = isActivePath(pathname, link.match)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? "nav-link-active" : ""}`}
                onClick={closeMenu}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className={`nav-actions ${isOpen ? "nav-actions-open" : ""}`}>
          <Link href="/contact" className="nav-secondary-link" onClick={closeMenu}>
            Start Project
          </Link>
          <Link href="/plans" className="button nav-cta" onClick={closeMenu}>
            Browse Plans
          </Link>
        </div>
      </div>

      {isOpen ? <div className="nav-backdrop" onClick={closeMenu} aria-hidden="true" /> : null}
    </header>
  )
}
