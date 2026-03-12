export type QueryValue = string | number | Array<string | number> | null | undefined

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL

function normalizeApiPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`
}

export function buildApiUrl(path: string) {
  return new URL(normalizeApiPath(path), API_BASE_URL).toString()
}

export function buildQueryString(params: Record<string, QueryValue>) {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") {
      continue
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        continue
      }

      searchParams.set(key, value.join(","))
      continue
    }

    searchParams.set(key, String(value))
  }

  const queryString = searchParams.toString()

  return queryString ? `?${queryString}` : ""
}

export function buildStorageUrl(path: string | null | undefined) {
  if (!path) {
    return null
  }

  const normalizedPath = path.replace(/^\/+/, "")
  return new URL(`/storage/${normalizedPath}`, API_BASE_URL).toString()
}

export function moneyToNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return value
  }

  if (typeof value === "string") {
    const parsedValue = Number(value)

    return Number.isFinite(parsedValue) ? parsedValue : 0
  }

  return 0
}

export function formatKes(value: number | string | null | undefined) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(moneyToNumber(value))
}
