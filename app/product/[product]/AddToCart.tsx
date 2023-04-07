"use client";

import { useCartStore } from "@/app/hooks/useCartStore";
import { useCallback } from "react";

interface ICartType {
  name: string;
  image: string;
  id: string;
  quantity: number | 1;
  unit_amount: number | null;
}

const AddToCart: React.FC<ICartType> = ({
  id,
  name,
  image,
  unit_amount,
  quantity,
}) => {
  const cartStore = useCartStore();

  const handleAddProduct = useCallback(() => {
    cartStore.addProduct({
      id,
      name,
      image,
      unit_amount,
      quantity,
    });
  }, [cartStore, id, image, name, quantity, unit_amount]);
  return (
    <div>
      <button
        onClick={handleAddProduct}
        className="bg-teal-600 rounded-md px-6 py-2 my-12 text-white"
      >
        Add to cart
      </button>
    </div>
  );
};

export default AddToCart;
