"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { getProductReviews } from "@/lib/firebase/reviews"
import { cn } from "@/lib/utils"

interface ProductReviewSummaryProps {
  productId: string
  className?: string
}

export default function ProductReviewSummary({ productId, className }: ProductReviewSummaryProps) {
  const [reviewCount, setReviewCount] = useState<number>(0)
  const [averageRating, setAverageRating] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    
    async function fetchReviewStats() {
      if (!productId) {
        console.log("No productId provided");
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching reviews for product:", productId);
        const reviews = await getProductReviews(productId);
        
        if (!isMounted) return;

        if (!Array.isArray(reviews)) {
          throw new Error("Invalid reviews data received");
        }

        console.log("Review data for product", productId, ":", reviews);
        
        setReviewCount(reviews.length);
        
        if (reviews.length > 0) {
          const validReviews = reviews.filter(r => typeof r.rating === 'number' && !isNaN(r.rating));
          if (validReviews.length > 0) {
            const totalRating = validReviews.reduce((sum, review) => sum + review.rating, 0);
            const avg = totalRating / validReviews.length;
            setAverageRating(Math.round(avg * 10) / 10);
          } else {
            setAverageRating(0);
          }
        } else {
          setAverageRating(0);
        }
      } catch (err) {
        console.error("Error fetching review stats:", err);
        setError("Failed to load reviews");
        
        // Implement retry logic
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying (${retryCount}/${maxRetries})...`);
          setTimeout(fetchReviewStats, 1000 * retryCount);
          return;
        }
        
        if (isMounted) {
          setReviewCount(0);
          setAverageRating(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchReviewStats();
    
    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className={cn("flex items-center gap-2 mt-2", className)}>
        <div className="flex animate-pulse">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-gray-200" />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center gap-2 mt-2", className)}>
        <span className="text-sm text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 mt-2", className)}>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-5 w-5",
              i < Math.round(averageRating) ? "fill-[#e1a93c] text-[#e1a93c]" : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {reviewCount > 0 ? `${averageRating.toFixed(1)} (${reviewCount} review${reviewCount > 1 ? 's' : ''})` : "No reviews"}
      </span>
    </div>
  )
}
