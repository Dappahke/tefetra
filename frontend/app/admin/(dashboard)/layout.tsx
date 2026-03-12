import { ReactNode } from "react"
import { logoutAdminAction } from "@/app/admin/actions"
import AdminNav from "@/components/AdminNav"
import { requireAdminSession } from "@/lib/admin-session"

type AdminDashboardLayoutProps = {
  children: ReactNode
}

export default async function AdminDashboardLayout({
  children,
}: AdminDashboardLayoutProps) {
  await requireAdminSession()

  return (
    <main>
      <section className="page-section admin-page-section">
        <div className="container admin-shell">
          <aside className="admin-sidebar">
            <div className="admin-sidebar-top">
              <p className="eyebrow">Studio Operations</p>
              <h1 className="section-title-display admin-sidebar-title">TEFETRO Admin</h1>
              <p className="section-copy">
                Upload plans, manage add-ons, review payments, and publish client updates.
              </p>
            </div>

            <AdminNav />

            <form action={logoutAdminAction}>
              <button className="button button-secondary admin-logout" type="submit">
                Sign out
              </button>
            </form>
          </aside>

          <section className="admin-main">{children}</section>
        </div>
      </section>
    </main>
  )
}
