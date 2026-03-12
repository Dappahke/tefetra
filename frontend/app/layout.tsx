import "./globals.css"
import type { Metadata } from "next"
import { ReactNode } from "react"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: {
    default: "TEFETRO STUDIOS",
    template: "%s | TEFETRO STUDIOS",
  },
  description:
    "Digital architecture platform for diaspora and local clients buying plans, requesting consultations, and building in Kenya.",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon/favicon.ico"],
  },
  manifest: "/favicon/site.webmanifest",
}

type LayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="site-shell">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
