export type PaymentProvider = "stripe" | "mpesa"

export type SelectedAddOn = {
  id: number
  add_on_id: number | null
  name: string
  slug: string
  price: string
}

export type OrderResponse = {
  id: number
  customer_email: string
  product_id: number
  base_amount: string
  addons_amount: string
  amount_paid: string
  total_amount: string
  download_token: string
  project_notes: string | null
  status: "pending" | "paid" | "failed" | string
  payment_provider: string | null
  payment_reference: string | null
  payment_metadata?: Record<string, string | number | null> | null
  can_download: boolean
  selected_add_ons: SelectedAddOn[]
}

export type StripeCheckoutResponse = {
  order: OrderResponse
  checkout_url: string
  session_id: string
}

export type MpesaCheckoutResponse = {
  order: OrderResponse
  customer_message: string
  checkout_request_id: string | null
}
