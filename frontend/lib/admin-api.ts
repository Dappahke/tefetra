import "server-only"

import { buildApiUrl } from "@/lib/api"
import { AddOn } from "@/types/add-on"
import { AdminDashboard } from "@/types/admin"
import { ClientProject } from "@/types/client-portal"
import { ConsultationRequestRecord } from "@/types/consultation"
import { OrderResponse } from "@/types/order"
import { Product } from "@/types/product"

function getAdminApiKey() {
  const adminApiKey = process.env.ADMIN_API_KEY

  if (!adminApiKey) {
    throw new Error("ADMIN_API_KEY is not configured.")
  }

  return adminApiKey
}

export async function adminApiFetch<T>(
  path: string,
  init: RequestInit = {},
  allowEmpty = false
): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set("X-Admin-Key", getAdminApiKey())
  headers.set("Accept", "application/json")

  const response = await fetch(buildApiUrl(path), {
    ...init,
    cache: "no-store",
    headers,
  })

  if (!response.ok) {
    let message = `Admin API request failed: ${response.status}`

    try {
      const payload = (await response.json()) as { message?: string }
      message = payload.message ?? message
    } catch {
      message = response.statusText || message
    }

    throw new Error(message)
  }

  if (allowEmpty && response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function getAdminDashboard() {
  return adminApiFetch<AdminDashboard>("/api/admin/dashboard")
}

export function getAdminProducts() {
  return adminApiFetch<Product[]>("/api/admin/products")
}

export function getAdminAddOns() {
  return adminApiFetch<AddOn[]>("/api/admin/addons?include_inactive=1")
}

export function getAdminOrders() {
  return adminApiFetch<OrderResponse[]>("/api/admin/orders")
}

export function getAdminConsultations() {
  return adminApiFetch<ConsultationRequestRecord[]>("/api/admin/consultations")
}

export function getAdminClientProjects() {
  return adminApiFetch<ClientProject[]>("/api/admin/client-projects")
}
