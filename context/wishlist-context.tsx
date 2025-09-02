"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import type { Product } from "@/lib/types"
import { saveWishlist, getWishlist, clearWishlist as clearWishlistFromDB } from "@/lib/firebase/wishlist"
import { useAuth } from "@/context/auth-context"

interface WishlistContextType {
  wishlistItems: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const { user } = useAuth()
  const suppressNextSave = useRef(false)
  const loadedFromDB = useRef(false)

  // Load wishlist from Firestore or localStorage on initial render
  useEffect(() => {
    async function loadWishlist() {
      if (user?.uid) {
        const items = await getWishlist(user.uid)
        setWishlistItems(items)
      } else {
        const savedWishlist = localStorage.getItem("wishlist")
        if (savedWishlist) {
          try {
            setWishlistItems(JSON.parse(savedWishlist))
          } catch (error) {
            console.error("Error parsing wishlist from localStorage:", error)
          }
        }
      }
      loadedFromDB.current = true
    }
    loadWishlist()
  }, [user?.uid])

  // Save wishlist to Firestore or localStorage whenever it changes
  useEffect(() => {
    if (!loadedFromDB.current || suppressNextSave.current) {
      suppressNextSave.current = false
      return
    }
    if (user?.uid) {
      saveWishlist(user.uid, wishlistItems)
    } else {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
    }
  }, [wishlistItems, user?.uid])

  const addToWishlist = (product: Product) => {
    setWishlistItems((prevItems) => {
      if (prevItems.some((item) => item.id === product.id)) {
        return prevItems
      }
      const updated = [...prevItems, product]
      if (user?.uid) saveWishlist(user.uid, updated)
      return updated
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prevItems) => {
      const updated = prevItems.filter((item) => item.id !== productId)
      if (user?.uid) saveWishlist(user.uid, updated)
      return updated
    })
  }

  const clearWishlist = async () => {
    if (user?.uid) {
      await clearWishlistFromDB(user.uid)
      suppressNextSave.current = true
    }
    setWishlistItems([])
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
