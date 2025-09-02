import { db } from "@/firebase"
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where, updateDoc, orderBy } from "firebase/firestore"

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: number
  updatedAt: number
  helpful?: number
  status?: 'published' | 'hidden' | 'flagged'
}

export async function addOrUpdateReview(review: Omit<Review, "createdAt" | "updatedAt" | "id"> & { rating: number, comment: string }) {
  const now = Date.now()
  const reviewId = `${review.productId}_${review.userId}`
  const reviewRef = doc(collection(db, "reviews"), reviewId)
  
  // Get existing review if any
  const existingReview = await getDoc(reviewRef)
  const baseHelpful = existingReview.exists() ? (existingReview.data()?.helpful || 0) : 0
  
  await setDoc(reviewRef, {
    ...review,
    id: reviewId,
    createdAt: existingReview.exists() ? existingReview.data()?.createdAt : now,
    updatedAt: now,
    helpful: baseHelpful,
    status: 'published' // Set default status when creating/updating
  }, { merge: true })
}

export async function deleteReview(reviewId: string) {
  const reviewRef = doc(db, "reviews", reviewId)
  const reviewSnap = await getDoc(reviewRef)
  if (!reviewSnap.exists()) {
    throw new Error(`Review with id ${reviewId} does not exist in Firestore.`)
  }
  await deleteDoc(reviewRef)
}

export async function getProductReviews(productId: string) {
  try {
    console.log("Fetching reviews for product:", productId);
    if (!productId || typeof productId !== 'string') {
      console.error("Invalid productId provided:", productId);
      return [];
    }

    // Add retry logic
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const reviewsRef = collection(db, "reviews");
        const queryRef = query(
          reviewsRef,
          where("productId", "==", productId),
          orderBy("createdAt", "desc")
        );
        
        const querySnap = await getDocs(queryRef);
        
        // Map and filter reviews with strict data validation
        const reviews = querySnap.docs
          .map(doc => {
            try {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                // Strict validation and sanitization
                rating: Number.isFinite(data.rating) ? Math.min(Math.max(data.rating, 0), 5) : 0,
                comment: typeof data.comment === 'string' ? data.comment : "",
                userName: typeof data.userName === 'string' ? data.userName : "Anonymous",
                createdAt: Number.isFinite(data.createdAt) ? data.createdAt : Date.now(),
                updatedAt: Number.isFinite(data.updatedAt) ? data.updatedAt : Date.now(),
                helpful: Number.isInteger(data.helpful) ? data.helpful : 0,
                status: ['published', 'hidden', 'flagged'].includes(data.status) ? data.status : "published"
              } as Review & { id: string };
            } catch (docError) {
              console.error("Error processing review document:", docError);
              return null;
            }
          })
          .filter(review => review !== null); // Remove any failed conversions
        // Only return published reviews
        const filteredReviews = reviews.filter(review => review.status === 'published');
        console.log("Filtered reviews for product", productId, ":", filteredReviews);
        return filteredReviews;

      } catch (queryError) {
        if (retryCount < maxRetries - 1) {
          console.warn(`Retry attempt ${retryCount + 1} for productId ${productId}`);
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue;
        }
        throw queryError;
      }
    }
    return []; // Return empty array if all retries failed
  } catch (error) {
    console.error("Error fetching reviews for product", productId, ":", error);
    return [];
  }
}

export async function getUserReviewForProduct(productId: string, userId: string) {
  try {
    if (!productId || !userId) {
      console.error("Invalid productId or userId provided");
      return null;
    }

    const reviewRef = doc(collection(db, "reviews"), `${productId}_${userId}`);
    const reviewSnap = await getDoc(reviewRef);
    
    if (!reviewSnap.exists()) {
      return null;
    }

    const data = reviewSnap.data();
    return {
      id: reviewSnap.id,
      ...data,
      status: data.status || "published"
    } as Review & { id: string };
  } catch (error) {
    console.error("Error fetching user review:", error);
    return null;
  }
}

export async function getAllReviews() {
  try {
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const reviewsSnap = await getDocs(collection(db, "reviews"));
        const reviews = reviewsSnap.docs
          .map(doc => {
            try {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                // Apply same strict validation as in getProductReviews
                rating: Number.isFinite(data.rating) ? Math.min(Math.max(data.rating, 0), 5) : 0,
                comment: typeof data.comment === 'string' ? data.comment : "",
                userName: typeof data.userName === 'string' ? data.userName : "Anonymous",
                createdAt: Number.isFinite(data.createdAt) ? data.createdAt : Date.now(),
                updatedAt: Number.isFinite(data.updatedAt) ? data.updatedAt : Date.now(),
                helpful: Number.isInteger(data.helpful) ? data.helpful : 0,
                status: ['published', 'hidden', 'flagged'].includes(data.status) ? data.status : "published"
              } as Review & { id: string };
            } catch (docError) {
              console.error("Error processing review document:", docError);
              return null;
            }
          })
          .filter(review => review !== null && review.status === 'published');

        console.log("Fetched all reviews:", reviews.length);
        return reviews;
        
      } catch (queryError) {
        if (retryCount < maxRetries - 1) {
          console.warn(`Retry attempt ${retryCount + 1} for getAllReviews`);
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          continue;
        }
        throw queryError;
      }
    }
    return []; // Return empty array if all retries failed
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return [];
  }
}

// Increment the helpful count for a review
export async function markReviewAsHelpful(reviewId: string) {
  try {
    const reviewRef = doc(collection(db, "reviews"), reviewId)
    const reviewSnap = await getDoc(reviewRef)
    
    if (!reviewSnap.exists()) {
      console.error("Review not found:", reviewId)
      return false
    }

    await updateDoc(reviewRef, {
      helpful: (reviewSnap.data()?.helpful || 0) + 1
    })
    
    return true
  } catch (error) {
    console.error("Error marking review as helpful:", error)
    return false
  }
}

// Get a review by its ID
export async function getReviewById(reviewId: string): Promise<(Review & { id: string }) | null> {
  try {
    const reviewRef = doc(collection(db, "reviews"), reviewId)
    const reviewSnap = await getDoc(reviewRef)
    
    if (!reviewSnap.exists()) {
      return null
    }

    const data = reviewSnap.data()
    return {
      id: reviewSnap.id,
      ...data,
      helpful: data.helpful || 0,
      status: data.status || "published"
    } as Review & { id: string }
  } catch (error) {
    console.error("Error fetching review:", error)
    return null
  }
}
