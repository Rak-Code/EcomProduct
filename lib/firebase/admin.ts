import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function fetchIsAdmin(uid: string): Promise<boolean> {
  if (!uid) return false;
  const userDoc = await getDoc(doc(db, "users", uid));
  if (!userDoc.exists()) return false;
  const data = userDoc.data();
  return !!data.isAdmin;
}
