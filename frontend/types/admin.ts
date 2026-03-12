import { AddOn } from "@/types/add-on"
import { ClientProject } from "@/types/client-portal"
import { ConsultationRequestRecord } from "@/types/consultation"
import { OrderResponse } from "@/types/order"
import { Product } from "@/types/product"

export type AdminDashboard = {
  metrics: {
    products: number
    orders: number
    paid_orders: number
    consultations: number
    client_projects: number
  }
  recent_orders: OrderResponse[]
  recent_consultations: ConsultationRequestRecord[]
  recent_projects: ClientProject[]
}

export type AdminCollections = {
  products: Product[]
  addOns: AddOn[]
  orders: OrderResponse[]
  consultations: ConsultationRequestRecord[]
  clientProjects: ClientProject[]
}
