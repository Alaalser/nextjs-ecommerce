"use client";

import Image from "next/image";
import { useCartStore } from "@/app/hooks/useCartStore";
import { useCallback } from "react";
import { formatPrice } from "../components/product/PriceFormat";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import Checkout from "../checkout/Checkout";

type CartItem = {
  name: string;
  id: string;
  image: string;
  description?: string;
  quantity: number;
  unit_amount: number | null;
};

interface ICart {
  cart: CartItem[];
}

const CartItem: React.FC<ICart> = ({ cart }) => {
  const cartStore = useCartStore();

  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);

  const handleToggle = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      cartStore.toggleCart();
    },
    [cartStore]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleToggle}
      className="fixed w-full h-screen left-0 top-0 bg-black/25"
    >
      <motion.div
        layout
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className="w-full bg-white  absolute right-0 top-0 h-screen p-12 overflow-y-scroll text-gray-70 md:w-1/4"
      >
        {cartStore.onCheckout === "checkout" ? (
          <button
            onClick={() => cartStore.setCheckout("cart")}
            className="text-sm font-bold pb-12"
          >
            Back to cart
          </button>
        ) : (
          <button
            onClick={() => cartStore.toggleCart()}
            className="text-sm font-bold pb-12"
          >
            Back to store
          </button>
        )}
        {cartStore.onCheckout === "cart" && (
          <>
            <h1 className="text-2xl font-bold">Here is your shopping list</h1>
            {cart.map((item: any) => (
              <motion.div layout key={item.id} className="flex py-4 gap-4">
                <Image
                  className="rounded-md h-24"
                  src={item.image}
                  alt={item.name}
                  width={120}
                  height={120}
                />
                <div>
                  <h2>{item.name}</h2>

                  <div className="flex gap-2">
                    <h2>Quantity: {item.quantity}</h2>
                    <button
                      onClick={() =>
                        cartStore.removeProduct({
                          id: item.id,
                          image: item.image,
                          name: item.name,
                          unit_amount: item.unit_amount,
                          quantity: item.quantity,
                        })
                      }
                    >
                      <IoRemoveCircle />
                    </button>
                    <button
                      onClick={() =>
                        cartStore.addProduct({
                          id: item.id,
                          image: item.image,
                          name: item.name,
                          unit_amount: item.unit_amount,
                          quantity: item.quantity,
                        })
                      }
                    >
                      <IoAddCircle />
                    </button>
                  </div>
                  <p className="text-sm">
                    {item.unit_amount ? formatPrice(item.unit_amount) : ""}
                  </p>
                </div>
              </motion.div>
            ))}
          </>
        )}
        {cartStore.cart.length > 0 && cartStore.onCheckout === "cart" && (
          <>
            <p>Total :{formatPrice(totalPrice)}</p>
            <motion.div layout>
              <button
                onClick={() => cartStore.setCheckout("checkout")}
                className="py-2 mt-4 bg-teal-700 w-full text-white rounded-md"
              >
                Checkout
              </button>
            </motion.div>
          </>
        )}
        {cartStore.onCheckout === "checkout" && <Checkout />}
        <AnimatePresence>
          {!cartStore.cart.length && (
            <motion.div
              animate={{
                scale: 1,
                rotateZ: 0,
                opacity: 0.75,
              }}
              initial={{
                scale: 0.5,
                rotateZ: -10,
                opacity: 0,
              }}
              exit={{ scale: 0.5, rotateZ: -10, opacity: 0 }}
              className="flex flex-col items-center gap-12 text-2xl font-medium pt-56 opacity-75"
            >
              <h1>Uhhh...it is empty</h1>
              <Image
                src={"/shopping-cart.png"}
                alt="empty cart"
                width={200}
                height={200}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CartItem;
