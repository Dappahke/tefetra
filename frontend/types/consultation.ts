export type ConsultationFormState = {
  name: string
  email: string
  country: string
  plotLocation: string
  plotSize: string
  budgetRange: string
  projectTimeline: string
  serviceType: string
  description: string
}

export type ConsultationRequestRecord = {
  id: number
  name: string
  email: string
  country: string
  plot_location: string
  plot_size: string
  budget_range: string
  project_timeline: string
  service_type: string | null
  description: string
  status: string
}

export type ConsultationResponse = {
  message: string
  consultation_request: ConsultationRequestRecord
}
