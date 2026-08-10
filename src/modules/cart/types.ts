export type CartLine = { productId: string; quantity: number; customizationRef?: string };
export type CartState = { lines: CartLine[]; isBusiness: boolean };
