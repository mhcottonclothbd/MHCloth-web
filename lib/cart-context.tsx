'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Product } from '@/types'

// Cart item interface
export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

// Cart state interface
interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

// Cart actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }

// Cart context interface
interface CartContextType {
  state: CartState
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemById: (id: string) => CartItem | undefined
  getTotalPrice: () => number
  getItemCount: () => number
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity, selectedSize, selectedColor } = action.payload
      
      // Generate unique ID based on product and variants
      const itemId = `${product.id}-${selectedSize || 'no-size'}-${selectedColor || 'no-color'}`
      
      // Check if item already exists
      const existingItemIndex = state.items.findIndex(item => item.id === itemId)
      
      let newItems: CartItem[]
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          id: itemId,
          product,
          quantity,
          selectedSize,
          selectedColor
        }
        newItems = [...state.items, newItem]
      }
      
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        items: newItems,
        total,
        itemCount
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        items: newItems,
        total,
        itemCount
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id })
      }
      
      const newItems = state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
      
      const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
      
      return {
        items: newItems,
        total,
        itemCount
      }
    }
    
    case 'CLEAR_CART': {
      return {
        items: [],
        total: 0,
        itemCount: 0
      }
    }
    
    default:
      return state
  }
}

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0
}

/**
 * Cart provider component
 * Manages shopping cart state and provides cart operations
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  
  const addItem = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }
  
  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }
  
  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }
  
  const getItemById = (id: string) => {
    return state.items.find(item => item.id === id)
  }
  
  const getTotalPrice = () => {
    return state.total
  }
  
  const getItemCount = () => {
    return state.itemCount
  }
  
  const value: CartContextType = {
    state,
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemById,
    getTotalPrice,
    getItemCount
  }
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

/**
 * Hook to use cart context
 * @returns Cart context with state and actions
 */
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}