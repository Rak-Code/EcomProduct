"use client"

import { useEffect, useState, useCallback } from "react"
import { Star } from "lucide-react"
import { getAllReviews } from "@/lib/firebase/reviews"

interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: number
  updatedAt: number
  status?: 'published' | 'hidden' | 'flagged'
}

export default function HomepageReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const allReviews = await getAllReviews();
      if (Array.isArray(allReviews)) {
        // First check if review is a valid object with required fields
        const validReviews = allReviews.filter((review): review is Review => {
          if (!review || typeof review !== 'object') return false;
          
          // Skip hidden or flagged reviews
          if (review.status && ['hidden', 'flagged'].includes(review.status)) {
            return false;
          }
          
          // Check all required fields have correct types
          return (
            typeof review.id === 'string' &&
            typeof review.rating === 'number' &&
            typeof review.comment === 'string' &&
            typeof review.productId === 'string' &&
            typeof review.userId === 'string' &&
            typeof review.userName === 'string' &&
            typeof review.createdAt === 'number' &&
            typeof review.updatedAt === 'number' &&
            review.rating >= 1 &&
            review.rating <= 5 &&
            review.comment.trim().length > 0
          );
        });
        setReviews(validReviews);
      } else {
        console.warn('Unexpected reviews data format:', allReviews);
        setReviews([]);
      }
    } catch (err: unknown) {
      console.error('Error fetching reviews:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllReviews();

    // Add error boundary retry
    const retryTimeout = setTimeout(() => {
      if (reviews.length === 0 && error) {
        console.log('Retrying review fetch...');
        fetchAllReviews();
      }
    }, 5000);

    return () => clearTimeout(retryTimeout);
  }, [fetchAllReviews, error, reviews.length]);

  // Memoize top reviews calculation
  const topReviews = reviews
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 sm:h-5 sm:w-5 ${
          i < rating
            ? "fill-[#e1a93c] text-[#e1a93c]"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 min-h-[400px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-block bg-[#e1a93c]/10 px-3 py-1 rounded-full text-black text-sm font-medium mb-4">
            Customer Testimonials
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium mb-4 text-gray-900">
            What Our Customers Say
          </h2>
          <p className="text-base sm:text-lg text-gray-700 px-4 sm:px-0">
            Don't just take our word for it - hear from cricket enthusiasts who love our bats
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {loading ? (
            <>
              {[1, 2, 3].map((n) => (
                <div 
                  key={n}
                  className="bg-white p-6 sm:p-8 rounded-lg shadow-lg flex flex-col min-h-[280px] sm:min-h-[300px]"
                >
                  <div className="animate-pulse space-y-4 w-full h-full">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 rounded-full"/>
                      ))}
                    </div>
                    <div className="space-y-3 flex-grow">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
                        <div className="h-3 bg-gray-200 rounded w-12 sm:w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : error ? (
            <div className="col-span-full text-center text-gray-500">
              <div className="mb-4">
                <p className="text-red-600 font-medium">Unable to load reviews</p>
                <p className="text-sm mt-1 px-4">{error}</p>
              </div>
              <button
                onClick={() => fetchAllReviews()}
                className="bg-[#e1a93c] hover:bg-[#e0e000] text-black px-6 py-2 rounded-full transition-colors duration-300 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : topReviews.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              <p className="text-base sm:text-lg">No reviews available at the moment.</p>
              <p className="text-sm mt-2">Be the first to share your experience!</p>
            </div>
          ) : (
            topReviews.map((review) => (
              <div 
                key={`${review.userId}_${review.productId}`} 
                className="bg-white p-6 sm:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full min-h-[280px] sm:min-h-[300px]"
              >
                <div className="flex mb-4 justify-start">
                  {renderStars(review.rating)}
                </div>
                <div className="flex-grow mb-6">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex items-center mt-auto">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-[#e1a93c] to-[#e0e000] flex items-center justify-center text-black font-bold mr-3 text-xs sm:text-sm flex-shrink-0">
                    {review.userName ? review.userName.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                      {review.userName || "Anonymous"}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-8 sm:mt-12">
          <a
            href="https://www.google.com/search?sca_esv=7b25cd0517fa32c5&sxsrf=AE3TifMe8EgR9p6dBKPS0PZABJSnAVh1mA:1749806774824&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E5jajGc4QCnf2OJs2Q9Qjl0Nc9wNWLCV3mWWARlQLglZpctB95P-e7eLt-9PU573oTIT1B3HONXLUjvguIbFHAZgdxbd&q=72+Sports+Bat+Reviews&sa=X&ved=2ahUKEwjEtvSZiu6NAxVNyDgGHbKlGq4Q0bkNegQIJRAD&biw=1536&bih=730&dpr=1.25#lrd=0x3be7c9fc53677c65:0xdf81eec3d63c6747,1,,,,"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="border border-black text-black hover:bg-black hover:text-white rounded-full px-6 sm:px-8 py-2 text-base sm:text-lg transition-colors duration-300">
              View Google Reviews
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}