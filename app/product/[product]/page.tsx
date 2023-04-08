import Image from "next/image";
import { formatPrice } from "@/app/components/product/PriceFormat";
import AddToCart from "./AddToCart";

interface ISearchParams {
  name: string;
  image: string;
  unit_amount: number | null;
  id: string;
  description?: string | null;
  quantity?: number | 1;
  features: string;
}

const ProductPage = async ({
  searchParams,
}: {
  searchParams: ISearchParams;
}) => {
  return (
    <div className="lg:flex block justify-between gap-24 lg:p-6 text-gray-700 ">
      <Image
        alt="Picture of the product"
        src={searchParams.image}
        width={600}
        height={600}
        className="w-full h-96 object-cover rounded-lg"
      />
      <div className="font-medium text-gray-600">
        <h1 className="text-2xl py-10 md:py-2">{searchParams.name}</h1>
        <p>{searchParams.description}</p>
        <p className="py-2">{searchParams.features}</p>
        <div className="flex gap-2">
          <p className="font-bold text-teal-700">
            {searchParams?.unit_amount
              ? formatPrice(searchParams?.unit_amount)
              : ""}
          </p>
        </div>
        <AddToCart
          unit_amount={searchParams?.unit_amount}
          id={searchParams.id}
          name={searchParams.name}
          image={searchParams.image}
          quantity={searchParams.quantity as number}
          key={searchParams.id}
        />
      </div>
    </div>
  );
};

export default ProductPage;
