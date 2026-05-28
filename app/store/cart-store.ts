'use client'
import { create } from 'zustand'

type CartItem = {
  id: string
  product_id: string
  name: string
  price: number
  image: string | null
  quantity: number
}

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  total: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.id === item.id)
    if (existing) {
      return {
        items: state.items.map(i => 
          i.id === item.id? {...i, quantity: i.quantity + 1 } : i
        )
      }
    }
    return { items: [...state.items, {...item, quantity: 1 }] }
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id!== id)
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    items: quantity <= 0 
     ? state.items.filter(i => i.id!== id)
      : state.items.map(i => i.id === id? {...i, quantity } : i)
  })),
  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen:!state.isOpen })),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
}))
