import { buildApiUrl, buildQueryString } from "@/lib/api"
import { AddOn } from "@/types/add-on"
import { ClientProject } from "@/types/client-portal"
import { OrderResponse } from "@/types/order"
import { Product } from "@/types/product"

export type ProductFilters = {
  bedrooms?: string[]
  minPrice?: string
  maxPrice?: string
  minArea?: string
  maxArea?: string
  sort?: string
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function getProducts(filters: ProductFilters = {}) {
  const query = buildQueryString({
    bedrooms: filters.bedrooms,
    min_price: filters.minPrice,
    max_price: filters.maxPrice,
    min_area: filters.minArea,
    max_area: filters.maxArea,
    sort: filters.sort,
  })

  return fetchJson<Product[]>(`/api/products${query}`)
}

export async function getFeaturedProducts(limit = 6) {
  const products = await getProducts({ sort: "latest" })

  return products.slice(0, limit)
}

export async function getProduct(id: string | number) {
  return fetchJson<Product>(`/api/products/${id}`)
}

export async function getAddOns() {
  return fetchJson<AddOn[]>("/api/addons")
}

export async function getOrderStatus(token: string) {
  return fetchJson<OrderResponse>(`/api/orders/${token}/status`)
}

export async function getStripeSessionStatus(sessionId: string) {
  const query = buildQueryString({ session_id: sessionId })

  return fetchJson<OrderResponse>(`/api/payments/stripe/session-status${query}`)
}

export async function getClientProject(token: string) {
  return fetchJson<ClientProject>(`/api/client-portal/${token}`)
}
