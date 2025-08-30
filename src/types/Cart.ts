export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
}