import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const SESSION_COOKIE = "tefetro_admin_session"

function getAdminEmail() {
  return process.env.ADMIN_EMAIL ?? "admin@tefetro.studio"
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "ChangeMe123!"
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "change-this-admin-session-secret"
}

function buildSessionToken() {
  return createHmac("sha256", getSessionSecret())
    .update(getAdminEmail())
    .digest("hex")
}

export function hasValidAdminCredentials(email: string, password: string) {
  return email === getAdminEmail() && password === getAdminPassword()
}

export async function setAdminSession() {
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, buildSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies()
  const currentValue = cookieStore.get(SESSION_COOKIE)?.value
  const expectedValue = buildSessionToken()

  if (!currentValue || currentValue.length !== expectedValue.length) {
    return false
  }

  return timingSafeEqual(Buffer.from(currentValue), Buffer.from(expectedValue))
}

export async function requireAdminSession() {
  const isAuthenticated = await isAdminAuthenticated()

  if (!isAuthenticated) {
    redirect("/admin/login")
  }
}
