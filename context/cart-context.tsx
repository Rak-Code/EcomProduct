"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product, CartItem } from "@/lib/types"
import { saveCart, getCart, clearCart as clearCartFromDB } from "@/lib/firebase/cart"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

// Cart configuration
const CART_CONFIG = {
  MAX_ITEMS_PER_PRODUCT: 10,
  MAX_TOTAL_ITEMS: 50,
  MAX_CART_VALUE: 100000, // ₹1,00,000
  SESSION_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number) => boolean
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => boolean
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
  isCartFull: () => boolean
  getItemQuantity: (productId: string) => number
  canAddToCart: (product: Product, quantity?: number) => { canAdd: boolean; reason?: string }
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  // Enhanced cart persistence with expiration
  const saveToLocalStorage = (items: CartItem[]) => {
    const cartData = {
      items,
      timestamp: Date.now(),
      expiresAt: Date.now() + CART_CONFIG.SESSION_DURATION
    }
    localStorage.setItem("cart", JSON.stringify(cartData))
  }

  const loadFromLocalStorage = (): CartItem[] => {
    try {
      const savedData = localStorage.getItem("cart")
      if (!savedData) return []
      
      const cartData = JSON.parse(savedData)
      
      // Check if cart has expired
      if (cartData.expiresAt && Date.now() > cartData.expiresAt) {
        localStorage.removeItem("cart")
        return []
      }
      
      return cartData.items || cartData // Support legacy format
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      return []
    }
  }

  // Load cart from Firestore or localStorage on initial render
  useEffect(() => {
    async function loadCart() {
      setIsLoading(true)
      try {
        if (user?.uid) {
          const items = await getCart(user.uid)
          setCartItems(items)
        } else {
          const items = loadFromLocalStorage()
          setCartItems(items)
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        // Fallback to empty cart
        setCartItems([])
      } finally {
        setIsLoading(false)
      }
    }
    loadCart()
  }, [user?.uid])

  // Save cart to Firestore or localStorage whenever it changes
  useEffect(() => {
    if (isLoading) return // Don't save during initial load
    
    if (user?.uid) {
      saveCart(user.uid, cartItems).catch(error => {
        console.error("Error saving cart to Firestore:", error)
        // Fallback to localStorage
        saveToLocalStorage(cartItems)
      })
    } else {
      saveToLocalStorage(cartItems)
    }
  }, [cartItems, user?.uid, isLoading])

  // Validation function to check if item can be added to cart
  const canAddToCart = (product: Product, quantity = 1): { canAdd: boolean; reason?: string } => {
    // Check if product is in stock
    if (product.stock <= 0) {
      return { canAdd: false, reason: "Product is out of stock" }
    }
    
    // Check total items limit
    const totalItems = getCartItemCount()
    if (totalItems + quantity > CART_CONFIG.MAX_TOTAL_ITEMS) {
      return { canAdd: false, reason: `Cart can contain maximum ${CART_CONFIG.MAX_TOTAL_ITEMS} items` }
    }
    
    // Check per-product quantity limit
    const currentQuantity = getItemQuantity(product.id)
    if (currentQuantity + quantity > CART_CONFIG.MAX_ITEMS_PER_PRODUCT) {
      return { canAdd: false, reason: `Maximum ${CART_CONFIG.MAX_ITEMS_PER_PRODUCT} units allowed per product` }
    }
    
    // Check stock availability
    if (currentQuantity + quantity > product.stock) {
      const available = product.stock - currentQuantity
      return { canAdd: false, reason: `Only ${available} units available` }
    }
    
    // Check cart value limit
    const currentTotal = getCartTotal()
    const productPrice = product.discountPrice || product.price
    if (currentTotal + (productPrice * quantity) > CART_CONFIG.MAX_CART_VALUE) {
      return { canAdd: false, reason: `Cart value cannot exceed ₹${CART_CONFIG.MAX_CART_VALUE.toLocaleString()}` }
    }
    
    return { canAdd: true }
  }

  const addToCart = (product: Product, quantity = 1): boolean => {
    const validation = canAddToCart(product, quantity)
    
    if (!validation.canAdd) {
      toast({
        title: "Cannot add to cart",
        description: validation.reason,
        variant: "destructive"
      })
      return false
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item,
        )
      } else {
        return [...prevItems, { product, quantity }]
      }
    })
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
    
    return true
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number): boolean => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return true
    }

    const item = cartItems.find(item => item.product.id === productId)
    if (!item) return false
    
    // Validate new quantity
    if (quantity > CART_CONFIG.MAX_ITEMS_PER_PRODUCT) {
      toast({
        title: "Quantity limit exceeded",
        description: `Maximum ${CART_CONFIG.MAX_ITEMS_PER_PRODUCT} units allowed per product`,
        variant: "destructive"
      })
      return false
    }
    
    if (quantity > item.product.stock) {
      toast({
        title: "Insufficient stock",
        description: `Only ${item.product.stock} units available`,
        variant: "destructive"
      })
      return false
    }

    setCartItems((prevItems) => 
      prevItems.map((item) => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
    
    return true
  }

  const clearCart = () => {
    setCartItems([])
    if (user?.uid) {
      clearCartFromDB(user.uid).catch(error => {
        console.error("Error clearing cart from Firestore:", error)
      })
    } else {
      localStorage.removeItem("cart")
    }
    
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price
      return total + price * item.quantity
    }, 0)
  }
  
  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }
  
  const isCartFull = () => {
    return getCartItemCount() >= CART_CONFIG.MAX_TOTAL_ITEMS
  }
  
  const getItemQuantity = (productId: string) => {
    const item = cartItems.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        isCartFull,
        getItemQuantity,
        canAddToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
