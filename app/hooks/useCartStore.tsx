import { create } from "zustand";
import { persist } from "zustand/middleware";

type Cart = {
  name: string;
  id: string;
  images: string[];
  description?: number;
  quantity: number;
};

interface IUseCartStore {
  isOpen: boolean;
  cart: Cart[];
  toggleCart: () => void;
}

export const useCartStore = create<IUseCartStore>()(
  persist(
    (set) => ({
      cart: [],
      isOpen: false,
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    { name: "cart-store" }
  )
);
