"use client";
import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";
import { cartReducer, emptyCart, type CartAction } from "@/modules/cart/cart-store";
import type { CartState } from "@/modules/cart/types";
const STORAGE_KEY = "presentei-cart-v1";
const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction>; ready: boolean } | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, emptyCart);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    queueMicrotask(() => {
      try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) dispatch({ type: "hydrate", state: JSON.parse(saved) as CartState }); }
      catch { localStorage.removeItem(STORAGE_KEY); }
      setReady(true);
    });
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [ready, state]);
  return <CartContext.Provider value={{ state, dispatch, ready }}>{children}</CartContext.Provider>;
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error("useCart precisa estar dentro de CartProvider"); return value; }
