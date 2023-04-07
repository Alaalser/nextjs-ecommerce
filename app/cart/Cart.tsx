"use client";

import { useCartStore } from "@/app/hooks/useCartStore";
import { AnimatePresence } from "framer-motion";
import CartItem from "./CartItem";

const Cart = () => {
  const cartStore = useCartStore();

  return (
    <AnimatePresence>
      <CartItem cart={cartStore.cart} />
    </AnimatePresence>
  );
};

export default Cart;
