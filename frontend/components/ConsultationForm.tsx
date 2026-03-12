"use client"

import { buildApiUrl } from "@/lib/api"
import {
  budgetOptions,
  consultationReasons,
  serviceTypeOptions,
  timelineOptions,
} from "@/lib/site-content"
import { ConsultationFormState, ConsultationResponse } from "@/types/consultation"
import { FormEvent, useState } from "react"

type ConsultationFormProps = {
  defaultServiceType?: string
  title?: string
  description?: string
}

type ConsultationErrorResponse = {
  message?: string
  errors?: Record<string, string[]>
}

function createInitialState(defaultServiceType: string): ConsultationFormState {
  return {
    name: "",
    email: "",
    country: "",
    plotLocation: "",
    plotSize: "",
    budgetRange: "",
    projectTimeline: "",
    serviceType: defaultServiceType,
    description: "",
  }
}

export default function ConsultationForm({
  defaultServiceType = "",
  title = "Start a project consultation",
  description = "Tell us about your plot, budget, and project timeline so the studio can understand the brief.",
}: ConsultationFormProps) {
  const [form, setForm] = useState<ConsultationFormState>(() =>
    createInitialState(defaultServiceType)
  )
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<Key extends keyof ConsultationFormState>(
    key: Key,
    value: ConsultationFormState[Key]
  ) {
    setForm((currentValue) => ({
      ...currentValue,
      [key]: value,
    }))
  }

  async function submitConsultation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsSubmitting(true)
      setErrorMessage("")
      setSuccessMessage("")

      const response = await fetch(buildApiUrl("/api/consultations"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          country: form.country.trim(),
          plot_location: form.plotLocation.trim(),
          plot_size: form.plotSize.trim(),
          budget_range: form.budgetRange,
          project_timeline: form.projectTimeline,
          service_type: form.serviceType || null,
          description: form.description.trim(),
        }),
      })

      const data = (await response.json()) as ConsultationResponse | ConsultationErrorResponse

      if (!response.ok) {
        const errorData = data as ConsultationErrorResponse
        const validationMessage = Object.values(errorData.errors ?? {})[0]?.[0]

        throw new Error(
          validationMessage || errorData.message || "Unable to submit consultation request."
        )
      }

      const successData = data as ConsultationResponse

      setSuccessMessage(
        successData.message || "Consultation request submitted successfully."
      )
      setForm(createInitialState(defaultServiceType))
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit consultation request."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="form-card">
      <div className="form-intro">
        <p className="eyebrow">Consultation Request</p>
        <h2 className="section-title-display">{title}</h2>
        <p className="section-copy">{description}</p>
      </div>

      <div className="tag-row form-tag-row">
        {consultationReasons.map((item) => (
          <span key={item} className="tag">
            {item}
          </span>
        ))}
      </div>

      <form className="form-grid" onSubmit={submitConsultation}>
        <label className="field">
          <span className="field-label">Full name</span>
          <input className="text-input" type="text" value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Your full name" />
        </label>

        <label className="field">
          <span className="field-label">Email address</span>
          <input className="text-input" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="you@example.com" />
        </label>

        <label className="field">
          <span className="field-label">Country</span>
          <input className="text-input" type="text" value={form.country} onChange={(event) => updateField("country", event.target.value)} placeholder="Country of residence" />
        </label>

        <label className="field">
          <span className="field-label">Plot location</span>
          <input className="text-input" type="text" value={form.plotLocation} onChange={(event) => updateField("plotLocation", event.target.value)} placeholder="Where is the site located in Kenya?" />
        </label>

        <label className="field">
          <span className="field-label">Plot size</span>
          <input className="text-input" type="text" value={form.plotSize} onChange={(event) => updateField("plotSize", event.target.value)} placeholder="50 x 100 ft, quarter acre, etc." />
        </label>

        <label className="field">
          <span className="field-label">Service type</span>
          <select className="select-input" value={form.serviceType} onChange={(event) => updateField("serviceType", event.target.value)}>
            <option value="">Select a service</option>
            {serviceTypeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Budget range</span>
          <select className="select-input" value={form.budgetRange} onChange={(event) => updateField("budgetRange", event.target.value)}>
            <option value="">Select budget range</option>
            {budgetOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field-label">Project timeline</span>
          <select className="select-input" value={form.projectTimeline} onChange={(event) => updateField("projectTimeline", event.target.value)}>
            <option value="">Select timeline</option>
            {timelineOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="field field-full">
          <span className="field-label">Project description</span>
          <textarea className="text-area" value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Describe the home, construction scope, sustainability goals, or technical support you need." />
        </label>

        <div className="field-full form-actions">
          <button className="button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit consultation request"}
          </button>
          <p className="form-note">The form captures early project information for diaspora and local clients.</p>
        </div>
      </form>

      {errorMessage && <p className="status-error">{errorMessage}</p>}
      {successMessage && <p className="status-success">{successMessage}</p>}
    </section>
  )
}
