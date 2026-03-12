import Link from "next/link"
import { formatKes } from "@/lib/api"
import { getAdminDashboard } from "@/lib/admin-api"

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboard()

  return (
    <div className="admin-stack">
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2 className="page-title">Operational overview.</h2>
        </div>
        <Link href="/plans" className="button button-secondary">
          View public marketplace
        </Link>
      </div>

      <div className="admin-metric-grid">
        <article className="metric-card">
          <p className="metric-label">Products</p>
          <p className="metric-value">{dashboard.metrics.products}</p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Orders</p>
          <p className="metric-value">{dashboard.metrics.orders}</p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Paid orders</p>
          <p className="metric-value">{dashboard.metrics.paid_orders}</p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Consultations</p>
          <p className="metric-value">{dashboard.metrics.consultations}</p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Client projects</p>
          <p className="metric-value">{dashboard.metrics.client_projects}</p>
        </article>
      </div>

      <div className="admin-overview-grid">
        <article className="content-card admin-panel-card">
          <div className="admin-panel-head">
            <h3>Recent orders</h3>
            <Link href="/admin/orders">Manage orders</Link>
          </div>
          <div className="admin-list">
            {dashboard.recent_orders.map((order) => (
              <div key={order.id} className="admin-list-row">
                <div>
                  <strong>Order #{order.id}</strong>
                  <p className="plan-meta">{order.customer_email}</p>
                </div>
                <div>
                  <strong>{formatKes(order.total_amount)}</strong>
                  <p className="plan-meta">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="content-card admin-panel-card">
          <div className="admin-panel-head">
            <h3>Consultation leads</h3>
            <Link href="/admin/consultations">Manage consultations</Link>
          </div>
          <div className="admin-list">
            {dashboard.recent_consultations.map((consultation) => (
              <div key={consultation.id} className="admin-list-row">
                <div>
                  <strong>{consultation.name}</strong>
                  <p className="plan-meta">{consultation.service_type ?? "General inquiry"}</p>
                </div>
                <div>
                  <strong>{consultation.status}</strong>
                  <p className="plan-meta">{consultation.country}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="content-card admin-panel-card">
        <div className="admin-panel-head">
          <h3>Client portal projects</h3>
          <Link href="/admin/client-portal">Manage client portal</Link>
        </div>
        <div className="admin-list">
          {dashboard.recent_projects.map((project) => (
            <div key={project.id} className="admin-list-row">
              <div>
                <strong>{project.title}</strong>
                <p className="plan-meta">{project.client_name} - {project.location}</p>
              </div>
              <div>
                <strong>{project.project_updates.length} updates</strong>
                <p className="plan-meta">{project.status}</p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}
