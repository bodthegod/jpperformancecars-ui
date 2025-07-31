import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartItem, Part } from "../types/types";

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Part }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { partId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

interface CartContextType {
  state: CartState;
  addItem: (part: Part) => void;
  removeItem: (partId: string) => void;
  updateQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.part.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.part.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
          itemCount: state.itemCount + 1,
        };
      } else {
        return {
          ...state,
          items: [...state.items, { part: action.payload, quantity: 1 }],
          total: state.total + action.payload.price,
          itemCount: state.itemCount + 1,
        };
      }
    }

    case "REMOVE_ITEM": {
      const itemToRemove = state.items.find(
        (item) => item.part.id === action.payload
      );
      if (!itemToRemove) return state;

      return {
        ...state,
        items: state.items.filter((item) => item.part.id !== action.payload),
        total: state.total - itemToRemove.part.price * itemToRemove.quantity,
        itemCount: state.itemCount - itemToRemove.quantity,
      };
    }

    case "UPDATE_QUANTITY": {
      const item = state.items.find(
        (item) => item.part.id === action.payload.partId
      );
      if (!item) return state;

      const quantityDiff = action.payload.quantity - item.quantity;

      return {
        ...state,
        items: state.items.map((item) =>
          item.part.id === action.payload.partId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + item.part.price * quantityDiff,
        itemCount: state.itemCount + quantityDiff,
      };
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };

    case "LOAD_CART":
      const total = action.payload.reduce(
        (sum, item) => sum + item.part.price * item.quantity,
        0
      );
      const itemCount = action.payload.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        items: action.payload,
        total,
        itemCount,
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: cartItems });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (part: Part) => {
    dispatch({ type: "ADD_ITEM", payload: part });
  };

  const removeItem = (partId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: partId });
  };

  const updateQuantity = (partId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(partId);
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { partId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
