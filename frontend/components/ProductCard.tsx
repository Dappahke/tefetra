import Image from "next/image"
import Link from "next/link"
import { buildStorageUrl, formatKes } from "@/lib/api"
import { Product } from "@/types/product"

type Props = {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const previewUrl = buildStorageUrl(product.preview_image)

  return (
    <Link href={`/products/${product.id}`} className="plan-card-link">
      <article className="plan-card">
        {previewUrl ? (
          <Image
            className="plan-image"
            src={previewUrl}
            alt={product.title}
            width={900}
            height={700}
          />
        ) : (
          <div className="plan-image plan-image-fallback">Preview coming soon</div>
        )}

        <div className="plan-content">
          <div className="plan-card-top">
            <span className="tag tag-solid">Ready-made plan</span>
            <p className="plan-price">{formatKes(product.price)}</p>
          </div>

          <h3 className="plan-title">{product.title}</h3>

          <div className="plan-spec-row">
            <span>{product.bedrooms} bedrooms</span>
            <span>{product.bathrooms} bathrooms</span>
            <span>{product.area_sqm} sqm</span>
          </div>

          <p className="plan-meta">
            {product.description || "Build-ready architectural drawing created for modern African living."}
          </p>

          <div className="plan-card-footer">
            <span>View plan details</span>
            <span aria-hidden="true">+</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
