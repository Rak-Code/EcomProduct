"use client"

import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import ProductReviewSummary from "@/components/product-review-summary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductActions from "@/components/product-actions"
import RelatedProducts from "@/components/related-products"
import ProductReviews from "@/components/product-reviews"
import RecommendedProducts from "@/components/recommended-products"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Suspense, useEffect, useState } from "react"
import { getProductById } from "@/lib/firebase/products"
import useSWR from "swr"
import { use as usePromise } from "react"
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  Clock, 
  Star,
  CheckCircle,
  AlertCircle,
  Package,
  Zap,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  // Unwrap params if it's a Promise (Next.js App Router migration)
  const unwrappedParams = typeof params?.then === "function" ? usePromise(params) : params;
  const id = unwrappedParams?.id;
  const [selectedImage, setSelectedImage] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)

  // Use SWR for fast, cached fetching of the product
  const fetchProduct = async (id: string) => {
    if (!id) return null;
    return await getProductById(id);
  };
  const { data: product, error, isLoading } = useSWR(id ? ["product", id] : null, () => fetchProduct(id));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-purple-100 rounded w-32"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-purple-100 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-purple-100 rounded w-3/4"></div>
              <div className="h-6 bg-purple-50 rounded w-1/2"></div>
              <div className="h-10 bg-purple-100 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-purple-50 rounded"></div>
                <div className="h-4 bg-purple-50 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Product</h2>
            <p className="text-red-600">{error.message || "Something went wrong while loading the product."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
  <Card className="border-purple-600 bg-purple-50">
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Product Not Found</h2>
            <p className="text-cyan-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-semibold hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700">
                Browse Products
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#d4af37] transition-colors duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-gray-100 bg-gray-50">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              width={600}
              height={600}
              className={cn(
                "h-full w-full object-cover transition-all duration-500",
                isImageLoading ? "scale-110 blur-sm" : "scale-100 blur-0"
              )}
              onLoadingComplete={() => setIsImageLoading(false)}
            />
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white px-3 py-1 text-sm font-semibold shadow-lg">
                  {discountPercentage}% OFF
                </Badge>
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white px-3 py-1 text-sm font-semibold shadow-lg">
                  NEW
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105",
                    selectedImage === index 
                      ? "border-purple-600 shadow-lg shadow-purple-200" 
                      : "border-gray-200 hover:border-purple-600"
                  )}
                >
                  <Image
                    src={image || "/placeholder.svg?height=150&width=150"}
                    alt={`${product.name} - Image ${index + 1}`}
                    width={150}
                    height={150}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full hover:border-purple-600 hover:text-purple-600">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:border-purple-600 hover:text-purple-600">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ProductReviewSummary productId={product.id} />
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-gray-500">SKU: {product.id.slice(-8).toUpperCase()}</span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            {product.discountPrice ? (
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">₹{product.discountPrice}</span>
                <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 px-2 py-1">
                  Save ₹{product.price - product.discountPrice}
                </Badge>
              </div>
            ) : (
              <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">₹{product.price}</span>
            )}
            
            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-green-600 font-medium">
                    {product.stock > 10 ? "In Stock" : `Only ${product.stock} left in stock`}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <Truck className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Free Shipping</p>
                <p className="text-sm text-gray-600">On orders over ₹8,300</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <Shield className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">1 Year Warranty</p>
                <p className="text-sm text-gray-600">Full coverage</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <Clock className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Fast Delivery</p>
                <p className="text-sm text-gray-600">2-3 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <Award className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Premium Quality</p>
                <p className="text-sm text-gray-600">Certified authentic</p>
              </div>
            </div>
          </div>

          {/* Product Actions */}
          <ProductActions product={product} />

          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full bg-purple-50 border border-purple-100">
              <TabsTrigger 
                value="description" 
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:via-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications" 
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:via-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="shipping" 
                className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:via-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
              >
                Shipping
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    Premium Features
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    This premium cricket bat is crafted from the finest materials to provide optimal performance on the
                    field. Designed for both professional players and enthusiasts, it offers the perfect balance of power
                    and control. Each bat undergoes rigorous quality testing to ensure consistency and durability.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="pt-6">
              <Card className="border-purple-100">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { label: "Brand", value: product.brand },
                      { label: "Material", value: "English Willow" },
                      { label: "Weight", value: "1.2 kg" },
                      { label: "Handle", value: "Premium Cane Handle" },
                      { label: "Blade Size", value: "Standard (Short Handle)" },
                      { label: "Sweet Spot", value: "Extended" },
                      { label: "Edge Thickness", value: "38-40mm" },
                      { label: "Warranty", value: "1 Year" }
                    ].map((spec, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <span className="font-medium text-gray-900">{spec.label}</span>
                        <span className="text-gray-700">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="pt-6">
              <div className="space-y-6">
                <Card className="border-purple-100">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-600">
                      <Truck className="h-5 w-5 text-purple-600" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      We offer free standard shipping on all orders over ₹8,300. For orders under ₹8,300, standard shipping
                      costs ₹830. All orders are processed within 1-2 business days.
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Delivery Options:</h4>
                      <div className="space-y-3">
                        {[
                          { type: "Standard Shipping", time: "5-7 business days", cost: "Free over ₹8,300" },
                          { type: "Express Shipping", time: "2-3 business days", cost: "₹1,245" },
                          { type: "Next Day Delivery", time: "Next business day", cost: "₹2,075 (order before 2pm)" }
                        ].map((option, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{option.type}</p>
                              <p className="text-sm text-gray-600">{option.time}</p>
                            </div>
                            <span className="font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">{option.cost}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Recommended Products Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Recommended For You</h2>
          <div className="h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-full flex-1 max-w-32"></div>
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-purple-100 rounded-xl mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-purple-100 rounded w-3/4"></div>
                  <div className="h-4 bg-purple-50 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        }>
          <RecommendedProducts excludeProductId={product.id} />
        </Suspense>
      </section>

      {/* Reviews and Related Products */}
      <div className="space-y-16">
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Customer Reviews</h2>
            <div className="h-1 bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] rounded-full flex-1 max-w-32"></div>
          </div>
          <Suspense fallback={
            <div className="space-y-6">
              <div className="animate-pulse bg-purple-50 h-32 rounded-xl"></div>
              <div className="animate-pulse bg-purple-50 h-24 rounded-xl"></div>
              <div className="animate-pulse bg-purple-50 h-28 rounded-xl"></div>
            </div>
          }>
            <ProductReviews productId={id} />
          </Suspense>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">You May Also Like</h2>
            <div className="h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-full flex-1 max-w-32"></div>
          </div>
          <RelatedProducts currentProductId={id} category={product.category} />
        </section>
      </div>
    </div>
  )
}