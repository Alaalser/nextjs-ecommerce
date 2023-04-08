"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "../hooks/useCartStore";

const OrderConfirmation = () => {
  const cartStore = useCartStore();

  useEffect(() => {
    cartStore.setPaymentIntent("");
    cartStore.clearCart();
  }, []);

  return (
    <motion.div
      className="
    flex flex-col  justify-center items-center
    "
      initial={{
        scale: 0.5,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
    >
      <div className="p-12 rounded-md text-center">
        <h1 className="text-xl font-medium">Your order has been placed</h1>
        <h2 className="text-sm my-4">Check your email for the receipt</h2>
        <Image
          src={"/giphy-downsized.gif"}
          alt="success"
          width={400}
          height={400}
          className="w-full my-8 object-cover rounded-lg"
        />
      </div>
      <div className="flex items-center justify-center gap-12 ">
        <Link href={"/dashboard"}>
          <button
            onClick={() => {
              setTimeout(() => {
                cartStore.setCheckout("cart");
              }, 300);
              cartStore.toggleCart();
            }}
            className="py-2 mt-4 w-full bg-teal-700 rounded-md text-white "
          >
            Check your order
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default OrderConfirmation;
