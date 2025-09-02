"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/product-card"
import type { Product } from "@/lib/types"
import { fetchFeaturedProducts } from "@/lib/firebase/products"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const featuredProducts = await fetchFeaturedProducts()
        setProducts(featuredProducts)
      } catch (error) {
        console.error("Error loading featured products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-lg p-4 space-y-4">
            <div className="aspect-square bg-premium-stone rounded-md animate-pulse" />
            <div className="h-4 bg-premium-stone rounded animate-pulse" />
            <div className="h-4 bg-premium-stone rounded w-2/3 animate-pulse" />
            <div className="h-6 bg-premium-stone rounded w-1/3 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  // Fallback for demo purposes if no products are loaded
  const demoProducts: Product[] =
    products.length > 0
      ? products
      : [
          {
            id: "1",
            name: "Pro Master English Willow Bat",
            description: "Premium grade 1 English willow cricket bat with optimal balance and power",
            price: 299.99,
            discountPrice: 249.99,
            images: ["/placeholder.svg?height=400&width=300"],
            category: "bats",
            featured: true,
            rating: 4.8,
            stock: 15,
            brand: "CricketGear",
          },
          {
            id: "2",
            name: "Elite Player Kashmir Willow Bat",
            description: "High-performance Kashmir willow bat for intermediate players",
            price: 149.99,
            images: ["/placeholder.svg?height=400&width=300"],
            category: "bats",
            featured: true,
            rating: 4.5,
            stock: 23,
            brand: "CricketGear",
          },
          {
            id: "3",
            name: "Professional Batting Pads",
            description: "Lightweight and durable batting pads with superior protection",
            price: 129.99,
            images: ["/placeholder.svg?height=400&width=300"],
            category: "pads",
            featured: true,
            rating: 4.6,
            stock: 18,
            brand: "CricketGear",
          },
          {
            id: "4",
            name: "Premium Batting Gloves",
            description: "High-quality batting gloves with extra padding for comfort",
            price: 79.99,
            images: ["/placeholder.svg?height=400&width=300"],
            category: "gloves",
            featured: true,
            rating: 4.4,
            stock: 25,
            brand: "CricketGear",
          },
        ]

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {demoProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="border-premium-navy text-premium-navy hover:bg-premium-navy/5"
          asChild
        >
          <Link href="/products">
            View All Products
          </Link>
        </Button>
      </div>
    </div>
  )
}
