import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  name: string;
  id: string;
  image: string;
  description?: string;
  quantity: number | 1;
  unit_amount: number | null;
};

interface IUseCartStore {
  isOpen: boolean;
  cart: CartItem[];
  toggleCart: () => void;
  addProduct: (item: CartItem) => void;
  removeProduct: (item: CartItem) => void;
  paymentIntent: string;
  onCheckout: string;
  setPaymentIntent: (val: string) => void;
  setCheckout: (val: string) => void;
}

export const useCartStore = create<IUseCartStore>()(
  persist(
    (set) => ({
      cart: [],
      isOpen: false,
      paymentIntent: "",
      onCheckout: "cart",
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addProduct: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          );
          if (existingItem) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.id === item.id) {
                return { ...cartItem, quantity: cartItem.quantity + 1 };
              }
              return cartItem;
            });
            return { cart: updatedCart };
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  ...item,
                  quantity: 1,
                },
              ],
            };
          }
        }),
      removeProduct: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          );
          if (existingItem && existingItem.quantity > 1) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.id === item.id) {
                return { ...cartItem, quantity: cartItem.quantity - 1 };
              }
              return cartItem;
            });
            return { cart: updatedCart };
          } else {
            const updatedCart = state.cart.filter(
              (cartItem) => cartItem.id !== item.id
            );
            return { cart: updatedCart };
          }
        }),
      setPaymentIntent: (val) => set((state) => ({ paymentIntent: val })),
      setCheckout: (val) => set((state) => ({ onCheckout: val })),
    }),
    { name: "cart-store" }
  )
);
