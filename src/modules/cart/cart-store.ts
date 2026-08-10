import type { CartLine, CartState } from "./types";
export const emptyCart: CartState = { lines: [], isBusiness: false };
export type CartAction = { type: "hydrate"; state: CartState } | { type: "add"; line: CartLine } | { type: "quantity"; productId: string; quantity: number } | { type: "remove"; productId: string } | { type: "business"; value: boolean };
export function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === "hydrate") return action.state;
  if (action.type === "business") return { ...state, isBusiness: action.value };
  if (action.type === "remove") return { ...state, lines: state.lines.filter((line) => line.productId !== action.productId) };
  if (action.type === "quantity") return { ...state, lines: state.lines.map((line) => line.productId === action.productId ? { ...line, quantity: Math.max(1, action.quantity) } : line) };
  const found = state.lines.find((line) => line.productId === action.line.productId);
  return { ...state, lines: found ? state.lines.map((line) => line.productId === action.line.productId ? { ...line, quantity: line.quantity + action.line.quantity } : line) : [...state.lines, action.line] };
}
