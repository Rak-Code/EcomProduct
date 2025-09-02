import { db } from "@/firebase"
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs } from "firebase/firestore"
import type { CartItem } from "@/lib/types"

export async function saveCart(userId: string, cartItems: CartItem[]) {
  await setDoc(doc(collection(db, "carts"), userId), { userId, cartItems })
}

export async function getCart(userId: string): Promise<CartItem[]> {
  const snap = await getDoc(doc(collection(db, "carts"), userId))
  if (!snap.exists()) return []
  return snap.data().cartItems || []
}

export async function clearCart(userId: string) {
  await deleteDoc(doc(collection(db, "carts"), userId))
}
