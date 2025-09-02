import { db } from "@/firebase"
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, updateDoc, deleteDoc } from "firebase/firestore"

export async function deleteOrder(orderId: string): Promise<boolean> {
  try {
    const orderRef = doc(collection(db, "orders"), orderId);
    await deleteDoc(orderRef);
    return true;
  } catch (error) {
    console.error("Error deleting order:", error);
    return false;
  }
}
import type { CartItem } from "@/lib/types"

export interface Order {
  id?: string
  userId: string
  items: CartItem[]
  total: number
  address: string
  status: string
  createdAt: number
  userEmail?: string
  userName?: string
}

export async function placeOrder(order: Omit<Order, "id">) {
  const orderRef = doc(collection(db, "orders"))
  await setDoc(orderRef, { ...order, id: orderRef.id })
  return orderRef.id
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const q = query(collection(db, "orders"), where("userId", "==", userId), orderBy("createdAt", "desc"))
  const snap = await getDocs(q)
  return snap.docs.map(doc => doc.data() as Order)
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const snap = await getDoc(doc(collection(db, "orders"), orderId))
  return snap.exists() ? (snap.data() as Order) : null
}

export async function getAllOrders(): Promise<Order[]> {
  const snap = await getDocs(collection(db, "orders"))
  return snap.docs.map(doc => doc.data() as Order)
}

export async function updateOrderStatus(orderId: string, status: string) {
  const orderRef = doc(collection(db, "orders"), orderId);
  // Defensive: always save status as lowercase
  await updateDoc(orderRef, {
    status: status.toLowerCase(),
    updatedAt: Date.now(),
  });
}
