"use client";

import { useCartStore } from "@/app/hooks/useCartStore";
import CartItem from "./CartItem";

const Cart = () => {
  const cartStore = useCartStore();

  return (
    <>
      <CartItem cart={cartStore.cart} />
    </>
  );
};

export default Cart;
