import { db } from "@/firebase"
import { collection, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import type { Product } from "@/lib/types"

export async function saveWishlist(userId: string, wishlistItems: Product[]) {
  await setDoc(doc(collection(db, "wishlists"), userId), { userId, wishlistItems })
}

export async function getWishlist(userId: string): Promise<Product[]> {
  const snap = await getDoc(doc(collection(db, "wishlists"), userId))
  if (!snap.exists()) return []
  return snap.data().wishlistItems || []
}

export async function clearWishlist(userId: string) {
  await deleteDoc(doc(collection(db, "wishlists"), userId))
}
