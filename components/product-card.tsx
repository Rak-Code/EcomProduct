"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Badge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import type { Product } from "@/lib/types"
import { cn } from "@/lib/utils"
import { getProductReviews } from "@/lib/firebase/reviews"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast()
  const { addToCart, canAddToCart, getItemQuantity } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist(product.id))
  const [isHovered, setIsHovered] = useState(false)
  const [reviewCount, setReviewCount] = useState<number>(0)
  const [averageRating, setAverageRating] = useState<number>(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [currentQuantity, setCurrentQuantity] = useState(0)

  useEffect(() => {
    setCurrentQuantity(getItemQuantity(product.id))
  }, [product.id, getItemQuantity])

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const timeoutIds: number[] = [];

    async function fetchReviewStats() {
      if (!product?.id) {
        console.log("No product ID available for review fetch");
        return;
      }
      try {
        const reviews = await getProductReviews(product.id);
        // Guard against component unmount
        if (!isMounted) return;
        
        // Safely handle the reviews array
        const validReviews = Array.isArray(reviews) ? reviews.filter(r => r && typeof r === 'object') : [];
        
        if (validReviews.length === 0 && retryCount < maxRetries) {
          console.log(`Retry ${retryCount + 1} for product ${product.id} reviews`);
          retryCount++;
          const timeoutId = window.setTimeout(fetchReviewStats, 1000 * retryCount); // Exponential backoff
          timeoutIds.push(timeoutId);
          return;
        }
        
        console.log(`Product ${product.id} reviews (${validReviews.length}):`, validReviews);
        
        setReviewCount(validReviews.length);
        
        if (validReviews.length > 0) {
          const totalRating = validReviews.reduce((sum: number, r: any) => {
            const rating = typeof r.rating === 'number' && !isNaN(r.rating) ? r.rating : 0;
            return sum + rating;
          }, 0);
          const avg = totalRating / validReviews.length;
          setAverageRating(Math.round(avg * 10) / 10); // Round to 1 decimal place
        } else {
          setAverageRating(0);
        }
      } catch (err) {
        console.error("Error fetching reviews for product", product.id, ":", err);
        if (isMounted) {
          setReviewCount(0);
          setAverageRating(0);
        }
      }
    }
    
    // Initial fetch
    fetchReviewStats();
    
    return () => {
      isMounted = false;
      // Clear any pending retry timeouts
      timeoutIds.forEach(clearTimeout);
    }
  }, [product.id])

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      const validation = canAddToCart(product)
      if (validation.canAdd) {
        const success = addToCart(product)
        if (success) {
          // Product successfully added
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => setIsAddingToCart(false), 500)
    }
  }

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id)
      setIsWishlisted(false)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
        className: "border-yellow-200 bg-yellow-50",
      })
    } else {
      addToWishlist(product)
      setIsWishlisted(true)
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
        className: "border-yellow-200 bg-yellow-50",
      })
    }
  }

  const calculateDiscountPercentage = () => {
    if (product.discountPrice && product.price) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100)
    }
    return 0
  }

  const discountPercentage = calculateDiscountPercentage()

  return (
    <div
      className="group relative rounded-xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 product-card border border-gray-100 hover:border-yellow-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute left-3 top-3 z-20">
          <div className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
            {discountPercentage}% OFF
          </div>
        </div>
      )}

      {/* New Badge */}
      {product.isNew && (
        <div className="absolute left-3 top-12 z-20">
          <div className="bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
            NEW
          </div>
        </div>
      )}

      {/* Wishlist Button */}
      <div className="absolute right-3 top-3 z-20">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110",
            isWishlisted 
              ? "bg-yellow-100/90 hover:bg-yellow-200/90" 
              : "bg-white/80 hover:bg-white/90"
          )}
          onClick={handleToggleWishlist}
        >
          <Heart 
            className={cn(
              "h-5 w-5 transition-all duration-300", 
              isWishlisted 
                ? "fill-[#d4af37] text-[#d4af37] scale-110" 
                : "text-gray-600 hover:text-[#d4af37]"
            )} 
          />
          <span className="sr-only">Add to wishlist</span>
        </Button>
      </div>

      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block overflow-hidden">
        <div className="aspect-square overflow-hidden relative">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={400}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient overlay on hover */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )} />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 space-y-3">
        {/* Rating */}
        {reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(averageRating)
                      ? "fill-[#d4af37] text-[#d4af37]"
                      : i < averageRating
                      ? "fill-yellow-200 text-yellow-200"
                      : "fill-gray-200 text-gray-200"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {averageRating.toFixed(1)} ({reviewCount} review{reviewCount > 1 ? 's' : ''})
            </span>
          </div>
        )}

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg line-clamp-2 bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] bg-clip-text text-transparent hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] transition-colors duration-200 leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Product Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between pt-3">
          <div className="space-y-1">
            {product.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] bg-clip-text text-transparent hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400]">
                  ₹{product.discountPrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.price}
                </span>
              </div>
            ) : (
              <span className="font-bold text-xl bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] bg-clip-text text-transparent hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400]">
                ₹{product.price}
              </span>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className={cn(
              "rounded-full transition-all duration-300 bg-gradient-to-r from-[#d4af37] via-[#c99700] to-[#b8860b] text-white hover:from-[#c99700] hover:via-[#b8860b] hover:to-[#a97400] shadow-lg hover:shadow-xl transform hover:scale-105",
              isHovered ? "w-auto px-4" : "w-11 px-0",
              isAddingToCart && "opacity-80 cursor-not-allowed"
            )}
          >
            <ShoppingCart
              className={cn("h-4 w-4 text-white", isHovered ? "mr-2" : "mr-0")}
            />
            {isHovered && !isAddingToCart && "Add to Cart"}
            {isHovered && isAddingToCart && "Adding..."}
          </Button>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="pt-2">
            {product.stock > 0 ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-600 font-medium">
                  {product.stock > 10 ? "In Stock" : `Only ${product.stock} left`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-xs text-red-600 font-medium">Out of Stock</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}