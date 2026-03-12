"use client"

import { AddOn } from "@/types/add-on"
import {
  MpesaCheckoutResponse,
  OrderResponse,
  PaymentProvider,
  StripeCheckoutResponse,
} from "@/types/order"
import { buildApiUrl, formatKes, moneyToNumber } from "@/lib/api"
import { Product } from "@/types/product"
import { useState } from "react"

type ProductPurchasePanelProps = {
  product: Product
  availableAddOns: AddOn[]
}

type ErrorResponse = {
  message?: string
  errors?: Record<string, string[]>
}

const paymentOptions: Array<{ value: PaymentProvider; label: string; description: string }> = [
  {
    value: "stripe",
    label: "Stripe",
    description: "Card checkout with a secure hosted payment page.",
  },
  {
    value: "mpesa",
    label: "M-Pesa",
    description: "Send an STK push to a Kenyan mobile number and confirm on phone.",
  },
]

export default function ProductPurchasePanel({
  product,
  availableAddOns,
}: ProductPurchasePanelProps) {
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<number[]>([])
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<PaymentProvider>("stripe")
  const [projectNotes, setProjectNotes] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function toggleAddOn(addOnId: number) {
    setSelectedAddOnIds((currentValue) =>
      currentValue.includes(addOnId)
        ? currentValue.filter((value) => value !== addOnId)
        : [...currentValue, addOnId]
    )
  }

  const selectedAddOns = availableAddOns.filter((addOn) =>
    selectedAddOnIds.includes(addOn.id)
  )
  const baseAmount = moneyToNumber(product.price)
  const addonsAmount = selectedAddOns.reduce(
    (sum, addOn) => sum + moneyToNumber(addOn.price),
    0
  )
  const totalAmount = baseAmount + addonsAmount

  async function startCheckout() {
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setErrorMessage("Please enter your email.")
      return
    }

    if (paymentMethod === "mpesa" && !phoneNumber.trim()) {
      setErrorMessage("Enter a Kenyan mobile number for M-Pesa checkout.")
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage("")
      setStatusMessage("")
      setOrder(null)

      const endpoint =
        paymentMethod === "stripe" ? "/api/checkouts/stripe" : "/api/checkouts/mpesa"
      const payload = {
        customer_email: trimmedEmail,
        product_id: product.id,
        addon_ids: selectedAddOnIds,
        project_notes: projectNotes.trim() || null,
        ...(paymentMethod === "mpesa"
          ? { phone_number: phoneNumber.trim() }
          : {}),
      }

      const response = await fetch(buildApiUrl(endpoint), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as
        | StripeCheckoutResponse
        | MpesaCheckoutResponse
        | ErrorResponse

      if (!response.ok) {
        const errorData = data as ErrorResponse
        const validationMessage = Object.values(errorData.errors ?? {})[0]?.[0]

        throw new Error(
          validationMessage || errorData.message || "Checkout could not be started."
        )
      }

      if (paymentMethod === "stripe") {
        const stripeData = data as StripeCheckoutResponse
        window.location.assign(stripeData.checkout_url)
        return
      }

      const mpesaData = data as MpesaCheckoutResponse
      setOrder(mpesaData.order)
      setStatusMessage(
        mpesaData.customer_message ||
          "M-Pesa prompt sent. Confirm payment on your phone."
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Checkout could not be started."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="checkout-panel">
      <div className="summary-row">
        <span>Base plan</span>
        <strong>{formatKes(product.price)}</strong>
      </div>

      <div className="notice-card payment-notice-card">
        <p>
          Secure checkout is now enabled. Card payments go through Stripe and
          Kenyan mobile payments go through M-Pesa STK push.
        </p>
      </div>

      <div className="addon-section">
        <h2 className="section-title-mini">Payment method</h2>
        <div className="payment-method-grid">
          {paymentOptions.map((option) => {
            const isSelected = paymentMethod === option.value

            return (
              <button
                key={option.value}
                type="button"
                className={
                  isSelected
                    ? "payment-method-card payment-method-card-selected"
                    : "payment-method-card"
                }
                onClick={() => setPaymentMethod(option.value)}
              >
                <strong>{option.label}</strong>
                <span>{option.description}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="addon-section">
        <h2 className="section-title-mini">Technical add-ons</h2>

        {availableAddOns.length > 0 ? (
          <div className="addon-list">
            {availableAddOns.map((addOn) => {
              const isSelected = selectedAddOnIds.includes(addOn.id)

              return (
                <label
                  key={addOn.id}
                  className={`addon-card${isSelected ? " addon-card-selected" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleAddOn(addOn.id)}
                  />

                  <div>
                    <div className="addon-header">
                      <span>{addOn.name}</span>
                      <strong>{formatKes(addOn.price)}</strong>
                    </div>

                    {addOn.description && (
                      <p className="plan-meta">{addOn.description}</p>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        ) : (
          <p className="plan-meta">No technical add-ons are available yet.</p>
        )}
      </div>

      <div className="addon-section">
        <h2 className="section-title-mini">Project notes</h2>
        <textarea
          className="text-area"
          placeholder="Add site notes, adaptation requests, or any follow-up service you want the studio to price."
          value={projectNotes}
          onChange={(event) => setProjectNotes(event.target.value)}
        />
      </div>

      <div className="summary-stack">
        <div className="summary-row">
          <span>Add-ons</span>
          <strong>{formatKes(addonsAmount)}</strong>
        </div>

        <div className="summary-row summary-row-total">
          <span>Total</span>
          <strong>{formatKes(totalAmount)}</strong>
        </div>
      </div>

      <div className="purchase-grid">
        <input
          className="text-input"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-label="Email address"
        />

        {paymentMethod === "mpesa" ? (
          <input
            className="text-input"
            type="tel"
            placeholder="Kenyan mobile number"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            aria-label="M-Pesa phone number"
          />
        ) : null}
      </div>

      <button className="button purchase-button" onClick={startCheckout} disabled={isSubmitting}>
        {isSubmitting
          ? "Starting checkout..."
          : paymentMethod === "stripe"
            ? "Continue to Stripe"
            : "Pay with M-Pesa"}
      </button>

      {errorMessage && <p className="status-error">{errorMessage}</p>}

      {statusMessage && order && (
        <div className="status-success order-success">
          <p>{statusMessage}</p>
          <p>
            Order status: <strong>{order.status}</strong>. Total: {formatKes(order.total_amount)}.
          </p>
          <div className="hero-actions">
            <a className="button" href={`/orders/${order.download_token}`}>
              Track payment status
            </a>
            {order.can_download ? (
              <a
                className="button button-secondary"
                href={buildApiUrl(`/api/download/${order.download_token}`)}
              >
                Download drawing pack
              </a>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
