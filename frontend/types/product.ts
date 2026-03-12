export type Product = {
  id: number
  title: string
  slug: string
  description: string | null
  price: string
  bedrooms: number
  bathrooms: number
  area_sqm: number
  preview_image: string | null
  file_url?: string | null
}
