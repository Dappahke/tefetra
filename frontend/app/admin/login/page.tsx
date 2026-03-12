import Link from "next/link"
import { redirect } from "next/navigation"
import { loginAdminAction } from "@/app/admin/actions"
import { isAdminAuthenticated } from "@/lib/admin-session"

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  if (await isAdminAuthenticated()) {
    redirect("/admin")
  }

  const params = await searchParams
  const errorMessage = params.error ? decodeURIComponent(params.error) : ""

  return (
    <main>
      <section className="page-section admin-login-section">
        <div className="container admin-login-wrap">
          <div className="admin-login-card form-card">
            <p className="eyebrow">Admin Dashboard</p>
            <h1 className="page-title">Sign in to manage plans, payments, and client projects.</h1>
            <p className="section-copy">
              This area is reserved for studio operations, catalog uploads, order review,
              and client portal updates.
            </p>

            <form className="admin-login-form" action={loginAdminAction}>
              <label className="field">
                <span className="field-label">Admin email</span>
                <input className="text-input" type="email" name="email" required />
              </label>

              <label className="field">
                <span className="field-label">Password</span>
                <input className="text-input" type="password" name="password" required />
              </label>

              <button className="button" type="submit">Sign in</button>
            </form>

            {errorMessage ? <p className="status-error">{errorMessage}</p> : null}

            <p className="form-note">
              Need the public site instead? <Link href="/">Return to TEFETRO STUDIOS</Link>.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
