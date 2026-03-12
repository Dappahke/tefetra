"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/addons", label: "Add-ons" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/consultations", label: "Consultations" },
  { href: "/admin/client-portal", label: "Client Portal" },
]

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={isActive(pathname, link.href) ? "admin-nav-link admin-nav-link-active" : "admin-nav-link"}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
