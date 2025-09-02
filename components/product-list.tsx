"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from "@/components/product-card"
import Pagination from "@/components/pagination"
import type { Product } from "@/lib/types"
import { fetchProducts, PaginatedProductsResult } from "@/lib/firebase/products"
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore"

export default function ProductList() {
  const searchParams = useSearchParams()
  const category = searchParams?.get("category") ?? undefined
  const minPrice = searchParams?.get("minPrice") ?? undefined
  const maxPrice = searchParams?.get("maxPrice") ?? undefined
  const brand = searchParams?.get("brand") ?? undefined
  const sort = searchParams?.get("sort") ?? undefined

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [prevDocs, setPrevDocs] = useState<QueryDocumentSnapshot<DocumentData>[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const PRODUCTS_PER_PAGE = 6

  const loadProducts = async (direction: "next" | "prev" | null = null) => {
    setLoading(true)
    setError(null)
    try {
      let startAfterDoc = null
      if (direction === "next") {
        startAfterDoc = lastVisible
      } else if (direction === "prev" && prevDocs.length > 1) {
        startAfterDoc = prevDocs[prevDocs.length - 2]
      }
      const filters = {
        category: category ? category : undefined,
        brand: brand ? brand : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort: sort ? sort : undefined,
      }
      const { products: fetched, lastVisible: newLastVisible } = await fetchProducts(filters, PRODUCTS_PER_PAGE, startAfterDoc ?? undefined)
      setProducts(fetched)
      setLastVisible(newLastVisible)
      if (direction === "next") {
        setPrevDocs((prev) => [...prev, newLastVisible!])
        setCurrentPage((p) => p + 1)
      } else if (direction === "prev") {
        setPrevDocs((prev) => prev.slice(0, -1))
        setCurrentPage((p) => Math.max(1, p - 1))
      } else {
        setPrevDocs(newLastVisible ? [newLastVisible] : [])
        setCurrentPage(1)
      }
    } catch (e) {
      setError("Failed to load products.")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, brand, minPrice, maxPrice, sort])

  return (
    <div>
      {loading && <div className="py-12 text-center">Loading products...</div>}
      {error && <div className="py-12 text-center text-red-500">{error}</div>}
      {!loading && !error && products.length === 0 && (
        <div className="py-12 text-center">No products found.</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* Ensure navbar is re-rendered on wishlist/cart change by using a key */}
      {/* <Navbar key={`${wishlistItems.length}-${cartItems.length}`} /> */}
      <div className="flex justify-between items-center mt-8">
        <button
          className="px-4 py-2 border-0 rounded font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 disabled:opacity-50"
          onClick={() => loadProducts("prev")}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          className="px-4 py-2 border-0 rounded font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 disabled:opacity-50"
          onClick={() => loadProducts("next")}
          disabled={products.length < PRODUCTS_PER_PAGE || loading}
        >
          Next
        </button>
      </div>
    </div>
  )
}
