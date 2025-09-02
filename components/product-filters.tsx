"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

/**
 * ProductFilters Component
 * 
 * This component provides UI controls for filtering and sorting products.
 * It includes:
 * - Category filtering (All, Men, Women, Kids)
 * - Price sorting (Low to High, High to Low)
 * 
 * The component updates the URL with appropriate query parameters when filters change,
 * which triggers the product list to update accordingly.
 */

export default function ProductFilters() {
  // Next.js router for navigation
  const router = useRouter()
  
  // State for tracking sort order ("asc" = low to high, "desc" = high to low)
  const [sortOrder, setSortOrder] = useState<string>("asc")
  
  // State for tracking selected category ("all", "mens", "womens", "kids")
  const [category, setCategory] = useState<string>("all")

  /**
   * Handles changes to the sort order dropdown
   * 
   * @param e - Select element change event
   * 
   * This function:
   * 1. Updates the local sort order state
   * 2. Constructs the appropriate URL query parameters
   * 3. Navigates to the new URL, which triggers a product list refresh
   */
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Get the new sort order value from the event
    const order = e.target.value
    
    // Update component state
    setSortOrder(order)
    
    // Convert internal sort value to URL parameter format
    // "asc" becomes "price-asc", "desc" becomes "price-desc"
    const sortParam = order === "asc" ? "price-asc" : "price-desc"
    
    // Only include category in URL if it's not "all"
    const categoryParam = category !== "all" ? `category=${category}` : ""
    
    // Construct URL with proper query parameters
    let url = "/products"
    if (sortParam && categoryParam) {
      url += `?sort=${sortParam}&${categoryParam}`
    } else if (sortParam) {
      url += `?sort=${sortParam}`
    } else if (categoryParam) {
      url += `?${categoryParam}`
    }
    
    // Navigate to the constructed URL
    router.push(url)
  }

  /**
   * Handles changes to the category filter dropdown
   * 
   * @param e - Select element change event
   * 
   * This function:
   * 1. Updates the local category state
   * 2. Constructs the appropriate URL query parameters
   * 3. Navigates to the new URL, which triggers a product list refresh
   */
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Get the new category value from the event
    const cat = e.target.value
    
    // Update component state
    setCategory(cat)
    
    // Convert internal sort value to URL parameter format
    // "asc" becomes "price-asc", "desc" becomes "price-desc"
    const sortParam = sortOrder === "asc" ? "price-asc" : "price-desc"
    
    // Only include category in URL if it's not "all"
    const categoryParam = cat !== "all" ? `category=${cat}` : ""
    
    // Construct URL with proper query parameters
    let url = "/products"
    if (sortParam && categoryParam) {
      url += `?sort=${sortParam}&${categoryParam}`
    } else if (sortParam) {
      url += `?sort=${sortParam}`
    } else if (categoryParam) {
      url += `?${categoryParam}`
    }
    
    // Navigate to the constructed URL
    router.push(url)
  }

  return (
    <div className="w-full max-w-xs mb-6 flex flex-col gap-4">
      {/*
      <div>
        <label htmlFor="category" className="block text-base font-semibold mb-2">
          Filter by Category
        </label>
        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition text-base bg-white"
        >
          <option value="all">All</option>
          <option value="mens">Men</option>
          <option value="womens">Women</option>
          <option value="kids">Kids</option>
        </select>
      </div>
      */}
      <div>
        <label htmlFor="sort" className="block text-base font-semibold mb-2">
          Sort Products
        </label>
        <select
          id="sort"
          value={sortOrder}
          onChange={handleSortChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition text-base bg-white"
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  )
}
