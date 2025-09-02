import { NextRequest, NextResponse } from "next/server"
import { db } from "@/firebase"
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"

export async function GET(req: NextRequest) {
  try {
    // Get reviews directly from Firestore
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")
    const reviewsCollection = collection(db, "reviews")
    let reviewsQuery
    if (productId) {
      reviewsQuery = query(
        reviewsCollection,
        where("productId", "==", productId),
        orderBy("createdAt", "desc")
      )
    } else {
      reviewsQuery = query(reviewsCollection, orderBy("createdAt", "desc"))
    }
    const querySnapshot = await getDocs(reviewsQuery)
    const reviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return NextResponse.json({ reviews })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reviews", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
