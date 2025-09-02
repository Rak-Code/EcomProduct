"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { getProductReviews, markReviewAsHelpful } from "@/lib/firebase/reviews"

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [productReviews, setProductReviews] = useState<any[]>([])
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    async function fetchReviews() {
      if (!productId) {
        console.error("Missing productId");
        return;
      }

      setLoadingReviews(true);
      setError(null);

      try {
        console.log("Fetching reviews for product:", productId);
        const reviews = await getProductReviews(productId);
        
        if (!isMounted) return;

        if (!Array.isArray(reviews)) {
          throw new Error("Invalid reviews data received");
        }

        // Validate review data
        const validReviews = reviews.filter(review => 
          review && 
          typeof review === 'object' && 
          typeof review.rating === 'number' &&
          !isNaN(review.rating) &&
          review.status === 'published'
        );

        console.log("Valid reviews for product", productId, ":", validReviews);
        setProductReviews(validReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        
        // Implement retry logic
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying (${retryCount}/${maxRetries})...`);
          setTimeout(fetchReviews, 1000 * retryCount);
          return;
        }

        if (isMounted) {
          setError("Failed to load reviews");
          toast({ 
            title: "Error loading reviews", 
            description: "Please try refreshing the page",
            variant: "destructive" 
          });
        }
      } finally {
        if (isMounted) {
          setLoadingReviews(false);
        }
      }
    }

    fetchReviews();
    
    return () => {
      isMounted = false;
    };
  }, [productId, toast])

  const handleHelpfulClick = async (reviewId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to mark a review as helpful.",
        variant: "destructive",
      })
      return
    }

    try {
      const success = await markReviewAsHelpful(reviewId)
      if (success) {
        // Update local state
        setProductReviews(prev => 
          prev.map(review => 
            review.id === reviewId 
              ? { ...review, helpful: (review.helpful || 0) + 1 }
              : review
          )
        )

        toast({
          title: "Marked as helpful",
          description: "Thank you for your feedback!",
        })
      } else {
        throw new Error("Failed to mark review as helpful")
      }
    } catch (error) {
      console.error("Error marking review as helpful:", error)
      toast({
        title: "Error",
        description: "Could not mark review as helpful. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFlagClick = (reviewId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to report a review.",
        variant: "destructive",
      })
      return
    }

    setProductReviews(productReviews.map((review) => (review.id === reviewId ? { ...review, flagged: true } : review)))

    toast({
      title: "Review reported",
      description: "Thank you for helping us maintain quality reviews.",
    })
  }

  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length
      : 0

  const ratingCounts = [0, 0, 0, 0, 0]
  productReviews.forEach((review) => {
    ratingCounts[review.rating - 1]++
  })

  const ratingPercentages = ratingCounts.map((count) =>
    productReviews.length > 0 ? (count / productReviews.length) * 100 : 0,
  )

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-1">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-5 w-5",
                    star <= Math.round(averageRating) ? "fill-primary text-primary" : "fill-muted text-muted",
                  )}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground mb-4">Based on {productReviews.length} reviews</div>
            <div className="w-full space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="text-sm w-2">{rating}</div>
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${ratingPercentages[rating - 1]}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-muted-foreground w-8">{ratingCounts[rating - 1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t pt-8">
        <h3 className="font-semibold mb-6">Customer Reviews ({productReviews.length})</h3>
        {loadingReviews ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        ) : productReviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {productReviews.map((review) => (
              <div key={review.id || `${review.userId}_${review.productId}`} className="border-b pb-8 last:border-b-0">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.userAvatar} alt={review.userName} />
                    <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h4 className="font-medium">{review.userName}</h4>
                      <div className="text-sm text-muted-foreground">
                        {review.createdAt 
                          ? new Date(review.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : '-'}
                      </div>
                    </div>
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-4 w-4",
                            star <= review.rating ? "fill-primary text-primary" : "fill-muted text-muted",
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-sm mb-4">{review.comment}</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleHelpfulClick(review.id)}
                      >
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                      {!review.flagged ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleFlagClick(review.id)}
                        >
                          <Flag className="h-3 w-3 mr-1" />
                          Report
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Reported</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
