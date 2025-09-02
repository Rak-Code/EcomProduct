import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  deleteDoc,
  orderBy,
  limit as fsLimit,
  startAfter as fsStartAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import type { Product } from "@/lib/types";

// Firestore collection reference
const productsCollection = collection(db, "products");

export interface ProductFilters {
  category?: string | null;
  minPrice?: number;
  maxPrice?: number;
  brand?: string | null;
  sort?: string | null;
}

export interface PaginatedProductsResult {
  products: Product[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}

export async function fetchProducts(
  filters?: ProductFilters,
  pageSize: number = 20,
  startAfterDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<PaginatedProductsResult> {
  console.log('fetchProducts filters:', filters);
  let q = query(productsCollection);

  // Filtering
  if (filters) {
    if (filters.category) {
      const categories = filters.category.split(",");
      q = query(q, where("category", "in", categories));
    }
    if (filters.brand) {
      const brands = filters.brand.split(",");
      q = query(q, where("brand", "in", brands));
    }
    if (filters.minPrice !== undefined) {
      q = query(q, where("price", ">=", filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      q = query(q, where("price", "<=", filters.maxPrice));
    }
    if (filters.sort) {
      switch (filters.sort) {
        case "price-asc":
          q = query(q, orderBy("price", "asc"));
          break;
        case "price-desc":
          q = query(q, orderBy("price", "desc"));
          break;
        case "rating-desc":
          q = query(q, orderBy("rating", "desc"));
          break;
        case "name-asc":
          q = query(q, orderBy("name", "asc"));
          break;
      }
    }
  }

  q = query(q, fsLimit(pageSize));
  if (startAfterDoc) {
    q = query(q, fsStartAfter(startAfterDoc));
  }

  const querySnapshot = await getDocs(q);
  console.log('fetchProducts returned count:', querySnapshot.docs.length);
  const products = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
  const lastVisible = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;
  return { products, lastVisible };
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const q = query(productsCollection, where("featured", "==", true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
}

export async function getProductById(id: string): Promise<Product | null> {
  const docRef = doc(productsCollection, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Product;
}

export async function getRelatedProducts(currentProductId: string, category: string): Promise<Product[]> {
  const q = query(
    productsCollection,
    where("category", "==", category),
    where("id", "!=", currentProductId),
    fsLimit(4)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
}

export async function addProduct(product: Omit<Product, "id">): Promise<string> {
  const docRef = await addDoc(productsCollection, product);
  return docRef.id;
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const docRef = doc(productsCollection, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}
