"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "./PriceFormat";

interface IProduct {
  name: string;
  image: string;
  unit_amount: number | null;
  id: string;
  description?: string | null;
  quantity?: number | 1;
  metadata: {
    features: string;
  };
}

const ProductCard: React.FC<IProduct> = ({
  name,
  image,
  unit_amount,
  id,
  description,
  metadata,
}) => {
  const { features } = metadata;

  return (
    <Link
      href={{
        pathname: `/product/${id}`,
        query: { name, image, unit_amount, description, features },
      }}
    >
      <div className="text-gray-700">
        <Image
          src={image}
          alt={name}
          width={400}
          height={400}
          className="w-full h-96 object-cover rounded-lg"
        />
        <div className="font-medium">
          <h1>{name}</h1>
          <h1 className="text-sm text-teal-700">
            {unit_amount ? formatPrice(unit_amount) : ""}
          </h1>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
