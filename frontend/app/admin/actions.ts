"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { adminApiFetch } from "@/lib/admin-api"
import {
  clearAdminSession,
  hasValidAdminCredentials,
  requireAdminSession,
  setAdminSession,
} from "@/lib/admin-session"

function textValue(formData: FormData, key: string) {
  const value = formData.get(key)

  return typeof value === "string" ? value.trim() : ""
}

function maybeNumber(value: string) {
  return value ? Number(value) : undefined
}

function fileValue(formData: FormData, key: string) {
  const value = formData.get(key)

  return value instanceof File && value.size > 0 ? value : null
}

function checkboxValue(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .some((value) => ["1", "true", "on"].includes(String(value)))
}

async function submitMultipart(
  path: string,
  method: string,
  payload: FormData,
  revalidateTarget: string,
  allowEmpty = false
) {
  await requireAdminSession()

  await adminApiFetch(path, {
    method,
    body: payload,
  }, allowEmpty)

  revalidatePath(revalidateTarget)
  redirect(revalidateTarget)
}

async function submitJson(
  path: string,
  method: string,
  payload: Record<string, unknown>,
  revalidateTarget: string,
  allowEmpty = false
) {
  await requireAdminSession()

  await adminApiFetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }, allowEmpty)

  revalidatePath(revalidateTarget)
  redirect(revalidateTarget)
}

export async function loginAdminAction(formData: FormData) {
  const email = textValue(formData, "email")
  const password = textValue(formData, "password")

  if (!hasValidAdminCredentials(email, password)) {
    redirect("/admin/login?error=Invalid%20credentials")
  }

  await setAdminSession()
  redirect("/admin")
}

export async function logoutAdminAction() {
  await clearAdminSession()
  redirect("/admin/login")
}

export async function createProductAction(formData: FormData) {
  const payload = new FormData()
  payload.set("title", textValue(formData, "title"))
  payload.set("slug", textValue(formData, "slug"))
  payload.set("description", textValue(formData, "description"))
  payload.set("price", textValue(formData, "price"))
  payload.set("bedrooms", textValue(formData, "bedrooms"))
  payload.set("bathrooms", textValue(formData, "bathrooms"))
  payload.set("area_sqm", textValue(formData, "area_sqm"))

  const previewImage = fileValue(formData, "preview_image")
  const planFile = fileValue(formData, "plan_file")

  if (previewImage) {
    payload.set("preview_image", previewImage)
  }

  if (planFile) {
    payload.set("plan_file", planFile)
  }

  await submitMultipart("/api/admin/products", "POST", payload, "/admin/products")
}

export async function updateProductAction(formData: FormData) {
  const productId = textValue(formData, "product_id")
  const payload = new FormData()
  payload.set("title", textValue(formData, "title"))
  payload.set("slug", textValue(formData, "slug"))
  payload.set("description", textValue(formData, "description"))
  payload.set("price", textValue(formData, "price"))
  payload.set("bedrooms", textValue(formData, "bedrooms"))
  payload.set("bathrooms", textValue(formData, "bathrooms"))
  payload.set("area_sqm", textValue(formData, "area_sqm"))

  const previewImage = fileValue(formData, "preview_image")
  const planFile = fileValue(formData, "plan_file")

  if (previewImage) {
    payload.set("preview_image", previewImage)
  }

  if (planFile) {
    payload.set("plan_file", planFile)
  }

  await submitMultipart(`/api/admin/products/${productId}`, "PATCH", payload, "/admin/products")
}

export async function deleteProductAction(formData: FormData) {
  const productId = textValue(formData, "product_id")

  await submitJson(`/api/admin/products/${productId}`, "DELETE", {}, "/admin/products", true)
}

export async function createAddOnAction(formData: FormData) {
  await submitJson(
    "/api/admin/addons",
    "POST",
    {
      name: textValue(formData, "name"),
      slug: textValue(formData, "slug"),
      description: textValue(formData, "description") || null,
      price: maybeNumber(textValue(formData, "price")),
      is_active: checkboxValue(formData, "is_active"),
    },
    "/admin/addons"
  )
}

export async function updateAddOnAction(formData: FormData) {
  const addOnId = textValue(formData, "add_on_id")

  await submitJson(
    `/api/admin/addons/${addOnId}`,
    "PATCH",
    {
      name: textValue(formData, "name"),
      slug: textValue(formData, "slug"),
      description: textValue(formData, "description") || null,
      price: maybeNumber(textValue(formData, "price")),
      is_active: checkboxValue(formData, "is_active"),
    },
    "/admin/addons"
  )
}

export async function deleteAddOnAction(formData: FormData) {
  const addOnId = textValue(formData, "add_on_id")

  await submitJson(`/api/admin/addons/${addOnId}`, "DELETE", {}, "/admin/addons", true)
}

export async function updateOrderAction(formData: FormData) {
  const orderId = textValue(formData, "order_id")
  const amountPaid = textValue(formData, "amount_paid")
  const paymentProvider = textValue(formData, "payment_provider")
  const paymentReference = textValue(formData, "payment_reference")

  await submitJson(
    `/api/admin/orders/${orderId}`,
    "PATCH",
    {
      status: textValue(formData, "status"),
      payment_provider: paymentProvider || null,
      payment_reference: paymentReference || null,
      amount_paid: amountPaid ? Number(amountPaid) : undefined,
    },
    "/admin/orders"
  )
}

export async function updateConsultationAction(formData: FormData) {
  const consultationId = textValue(formData, "consultation_id")

  await submitJson(
    `/api/admin/consultations/${consultationId}`,
    "PATCH",
    {
      status: textValue(formData, "status"),
    },
    "/admin/consultations"
  )
}

export async function createClientProjectAction(formData: FormData) {
  const payload = new FormData()
  payload.set("client_name", textValue(formData, "client_name"))
  payload.set("client_email", textValue(formData, "client_email"))
  payload.set("title", textValue(formData, "title"))
  payload.set("location", textValue(formData, "location"))
  payload.set("status", textValue(formData, "status"))
  payload.set("summary", textValue(formData, "summary"))

  const coverImage = fileValue(formData, "cover_image")

  if (coverImage) {
    payload.set("cover_image", coverImage)
  }

  await submitMultipart(
    "/api/admin/client-projects",
    "POST",
    payload,
    "/admin/client-portal"
  )
}

export async function updateClientProjectAction(formData: FormData) {
  const projectId = textValue(formData, "project_id")
  const payload = new FormData()
  payload.set("client_name", textValue(formData, "client_name"))
  payload.set("client_email", textValue(formData, "client_email"))
  payload.set("title", textValue(formData, "title"))
  payload.set("location", textValue(formData, "location"))
  payload.set("status", textValue(formData, "status"))
  payload.set("summary", textValue(formData, "summary"))

  const coverImage = fileValue(formData, "cover_image")

  if (coverImage) {
    payload.set("cover_image", coverImage)
  }

  await submitMultipart(
    `/api/admin/client-projects/${projectId}`,
    "PATCH",
    payload,
    "/admin/client-portal"
  )
}

export async function deleteClientProjectAction(formData: FormData) {
  const projectId = textValue(formData, "project_id")

  await submitJson(
    `/api/admin/client-projects/${projectId}`,
    "DELETE",
    {},
    "/admin/client-portal",
    true
  )
}

export async function createProjectUpdateAction(formData: FormData) {
  const projectId = textValue(formData, "project_id")
  const payload = new FormData()
  payload.set("title", textValue(formData, "title"))
  payload.set("milestone", textValue(formData, "milestone"))
  payload.set("body", textValue(formData, "body"))
  payload.set("published_at", textValue(formData, "published_at"))

  const photo = fileValue(formData, "photo")

  if (photo) {
    payload.set("photo", photo)
  }

  await submitMultipart(
    `/api/admin/client-projects/${projectId}/updates`,
    "POST",
    payload,
    "/admin/client-portal"
  )
}

export async function updateProjectUpdateAction(formData: FormData) {
  const updateId = textValue(formData, "project_update_id")
  const payload = new FormData()
  payload.set("title", textValue(formData, "title"))
  payload.set("milestone", textValue(formData, "milestone"))
  payload.set("body", textValue(formData, "body"))
  payload.set("published_at", textValue(formData, "published_at"))

  const photo = fileValue(formData, "photo")

  if (photo) {
    payload.set("photo", photo)
  }

  await submitMultipart(
    `/api/admin/project-updates/${updateId}`,
    "PATCH",
    payload,
    "/admin/client-portal"
  )
}

export async function deleteProjectUpdateAction(formData: FormData) {
  const updateId = textValue(formData, "project_update_id")

  await submitJson(
    `/api/admin/project-updates/${updateId}`,
    "DELETE",
    {},
    "/admin/client-portal",
    true
  )
}
