export type ProjectUpdate = {
  id: number
  title: string
  milestone: string | null
  body: string
  photo_url: string | null
  published_at: string | null
}

export type ClientProject = {
  id: number
  client_name: string
  client_email: string
  title: string
  location: string
  status: string
  summary: string | null
  cover_image: string | null
  portal_token: string
  project_updates: ProjectUpdate[]
}
