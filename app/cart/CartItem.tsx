"use client";

import Image from "next/image";
import { useCartStore } from "@/app/hooks/useCartStore";
import { useCallback } from "react";
import { formatPrice } from "../components/product/PriceFormat";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";

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

  const handleToggle = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();

      cartStore.toggleCart();
    },
    [cartStore]
  );

  return (
    <div
      onClick={handleToggle}
      className="fixed w-full h-screen left-0 top-0 bg-black/25"
    >
      <div
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        className="w-1/4 bg-white  absolute right-0 top-0 h-screen p-12 overflow-y-scroll text-gray-70"
      >
        <h1 className="text-2xl font-bold">Here is your shopping list</h1>
        {cart.map((item: any) => (
          <div key={item.id} className="flex py-4 gap-4">
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
          </div>
        ))}
        {cartStore.cart.length > 0 && (
          <button className="py-2 mt-4 bg-teal-700 w-full text-white rounded-md">
            Checkout
          </button>
        )}
        {!cartStore.cart.length && (
          <div className="flex flex-col items-center gap-12 text-2xl font-medium pt-56 opacity-75">
            <h1>Uhhh...it is empty</h1>
            <Image
              src={"/shopping-cart.png"}
              alt="empty cart"
              width={200}
              height={200}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
