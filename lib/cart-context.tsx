"use client";

import { Product } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

// Cart item interface
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

// Cart state interface
interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Cart actions
type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "id"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

// Cart context interface
interface CartContextType {
  state: CartState;
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemById: (id: string) => CartItem | undefined;
  getTotalPrice: () => number;
  getItemCount: () => number;
  isLoading: boolean;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// localStorage key for cart persistence
const CART_STORAGE_KEY = "mhcloth-cart";

// Helper functions for localStorage
const saveCartToStorage = (state: CartState) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    }
  } catch (error) {
    console.warn("Failed to save cart to localStorage:", error);
  }
};

const loadCartFromStorage = (): CartState | null => {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate the structure
        if (
          parsed &&
          typeof parsed === "object" &&
          Array.isArray(parsed.items)
        ) {
          return parsed;
        }
      }
    }
  } catch (error) {
    console.warn("Failed to load cart from localStorage:", error);
  }
  return null;
};

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_CART": {
      return action.payload;
    }

    case "ADD_ITEM": {
      const { product, quantity, selectedSize, selectedColor } = action.payload;

      // Generate unique ID based on product and variants
      const itemId = `${product.id}-${selectedSize || "no-size"}-${
        selectedColor || "no-color"
      }`;

      // Check if item already exists
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === itemId
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: itemId,
          product,
          quantity,
          selectedSize,
          selectedColor,
        };
        newItems = [...state.items, newItem];
      }

      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      const newState = {
        items: newItems,
        total,
        itemCount,
      };

      // Save to localStorage
      saveCartToStorage(newState);
      return newState;
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      const newState = {
        items: newItems,
        total,
        itemCount,
      };

      // Save to localStorage
      saveCartToStorage(newState);
      return newState;
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: "REMOVE_ITEM", payload: id });
      }

      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      const newState = {
        items: newItems,
        total,
        itemCount,
      };

      // Save to localStorage
      saveCartToStorage(newState);
      return newState;
    }

    case "CLEAR_CART": {
      const newState = {
        items: [],
        total: 0,
        itemCount: 0,
      };

      // Save to localStorage
      saveCartToStorage(newState);
      return newState;
    }

    default:
      return state;
  }
}

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

/**
 * Cart provider component
 * Manages shopping cart state and provides cart operations with localStorage persistence
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = loadCartFromStorage();
    if (storedCart) {
      dispatch({ type: "LOAD_CART", payload: storedCart });
    }
    setIsLoading(false);
  }, []);

  const addItem = (item: Omit<CartItem, "id">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    // Also clear from localStorage
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.warn("Failed to clear cart from localStorage:", error);
    }
  };

  const getItemById = (id: string) => {
    return state.items.find((item) => item.id === id);
  };

  const getTotalPrice = () => {
    return state.total;
  };

  const getItemCount = () => {
    return state.itemCount;
  };

  const value: CartContextType = {
    state,
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemById,
    getTotalPrice,
    getItemCount,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook to use cart context
 * @returns Cart context with state and actions
 */
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
