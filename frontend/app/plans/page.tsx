export const dynamic = "force-dynamic"

import Link from "next/link"
import ProductCard from "@/components/ProductCard"
import SectionIntro from "@/components/SectionIntro"
import { getProducts } from "@/lib/catalog"
import { Product } from "@/types/product"

type SearchParams = {
  bedrooms?: string | string[]
  minPrice?: string
  maxPrice?: string
  minArea?: string
  maxArea?: string
  sort?: string
}

type PlansPageProps = {
  searchParams: Promise<SearchParams>
}

const bedroomOptions = [2, 3, 4, 5]

function normalizeList(value: string | string[] | undefined) {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

export default async function PlansPage({ searchParams }: PlansPageProps) {
  const resolvedSearchParams = await searchParams
  const bedrooms = normalizeList(resolvedSearchParams.bedrooms)
  const minPrice = resolvedSearchParams.minPrice ?? ""
  const maxPrice = resolvedSearchParams.maxPrice ?? ""
  const minArea = resolvedSearchParams.minArea ?? ""
  const maxArea = resolvedSearchParams.maxArea ?? ""
  const sort = resolvedSearchParams.sort ?? "latest"

  let products: Product[] = []
  let errorMessage = ""

  try {
    products = await getProducts({ bedrooms, minPrice, maxPrice, minArea, maxArea, sort })
  } catch (error) {
    console.error("Failed to fetch filtered plans", error)
    errorMessage = "Unable to load the plans marketplace right now."
  }

  const hasActiveFilters = bedrooms.length > 0 || !!minPrice || !!maxPrice || !!minArea || !!maxArea || sort !== "latest"

  return (
    <main>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <p className="eyebrow">Plans Marketplace</p>
            <h1 className="page-title">Browse ready-made architectural plans.</h1>
            <p className="page-copy">Filter by bedrooms, price range, and house size. Every plan can feed into a broader Tefetro consultation for technical add-ons or construction support.</p>
          </div>
          <div className="hero-mini-card">
            <p className="hero-board-label">Marketplace objective</p>
            <strong>Sell plans and capture higher-value leads.</strong>
            <span>Digital products move quickly, while consultations convert custom design and construction projects.</span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container filter-layout">
          <aside className="filter-panel">
            <SectionIntro eyebrow="Filters" title="Narrow the catalog" description="Use the catalog filters to compare house types before opening a plan page." />
            <form className="filter-form" method="get">
              <div className="filter-group">
                <p className="filter-label">Bedrooms</p>
                <div className="checkbox-list">
                  {bedroomOptions.map((option) => (
                    <label key={option} className="checkbox-option">
                      <input type="checkbox" name="bedrooms" value={String(option)} defaultChecked={bedrooms.includes(String(option))} />
                      <span>{option} bedrooms</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <p className="filter-label">Price range</p>
                <div className="filter-input-grid">
                  <input className="text-input" name="minPrice" type="number" min="0" defaultValue={minPrice} placeholder="Min price" />
                  <input className="text-input" name="maxPrice" type="number" min="0" defaultValue={maxPrice} placeholder="Max price" />
                </div>
              </div>

              <div className="filter-group">
                <p className="filter-label">House size</p>
                <div className="filter-input-grid">
                  <input className="text-input" name="minArea" type="number" min="0" defaultValue={minArea} placeholder="Min sqm" />
                  <input className="text-input" name="maxArea" type="number" min="0" defaultValue={maxArea} placeholder="Max sqm" />
                </div>
              </div>

              <div className="filter-group">
                <p className="filter-label">Sort by</p>
                <select className="select-input" name="sort" defaultValue={sort}>
                  <option value="latest">Latest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="area_asc">Area: Small to Large</option>
                  <option value="area_desc">Area: Large to Small</option>
                </select>
              </div>

              <div className="filter-actions">
                <button className="button" type="submit">Apply filters</button>
                <Link href="/plans" className="button button-ghost">Clear</Link>
              </div>
            </form>

            <div className="notice-card">
              <p>Need something tailored to a plot, budget, or phased build? Move into a consultation instead of forcing the project into a ready-made plan.</p>
              <Link href="/consultation-request" className="service-link">Request consultation</Link>
            </div>
          </aside>

          <div>
            <div className="results-header">
              <div>
                <p className="eyebrow">Catalog Results</p>
                <h2 className="section-title-display">{products.length} plans available</h2>
              </div>
              {hasActiveFilters && <p className="plan-meta">Filtered results based on your current criteria.</p>}
            </div>
            {errorMessage && <p className="status-error">{errorMessage}</p>}
            {products.length > 0 ? (
              <div className="plan-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No plans match the current filters.</h3>
                <p>Try widening the budget or house size range, or start a consultation for a custom project.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
