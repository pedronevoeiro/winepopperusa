"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  variantId: string
  title: string
  variantTitle?: string
  price: number // in cents
  compareAtPrice?: number
  quantity: number
  image?: string
  handle: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  discountCode: string | null
  discountAmount: number // in cents

  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  applyDiscount: (code: string, amount: number) => void
  removeDiscount: () => void

  // Computed
  totalItems: () => number
  subtotal: () => number
  total: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      discountCode: null,
      discountAmount: 0,

      addItem: (item) => {
        const { items } = get()
        const existing = items.find((i) => i.variantId === item.variantId)

        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
            isOpen: true,
          })
        } else {
          set({
            items: [...items, { ...item, quantity: item.quantity || 1 }],
            isOpen: true,
          })
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) })
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => {
        set({ items: [], discountCode: null, discountAmount: 0 })
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      applyDiscount: (code, amount) => {
        set({ discountCode: code, discountAmount: amount })
      },

      removeDiscount: () => {
        set({ discountCode: null, discountAmount: 0 })
      },

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      total: () => {
        const subtotal = get().subtotal()
        return Math.max(0, subtotal - get().discountAmount)
      },
    }),
    {
      name: "winepopper-cart",
      partialize: (state) => ({
        items: state.items,
        discountCode: state.discountCode,
        discountAmount: state.discountAmount,
      }),
    }
  )
)
