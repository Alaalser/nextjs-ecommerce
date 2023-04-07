import Image from "next/image";
import { formatPrice } from "@/app/components/product/PriceFormat";

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
  console.log(searchParams.features);

  return (
    <div className="flex justify-between gap-24 p-12 text-gray-700">
      <Image
        alt="Picture of the product"
        src={searchParams.image}
        width={600}
        height={600}
        className="w-full h-96 object-cover rounded-lg"
      />
      <div className="font-medium text-gray-600">
        <h1 className="text-2xl py-2">{searchParams.name}</h1>
        <p>{searchParams.description}</p>
        <p className="py-2">{searchParams.features}</p>
        <div className="flex gap-2">
          <p className="font-bold text-teal-700">
            {searchParams?.unit_amount
              ? formatPrice(searchParams?.unit_amount)
              : ""}
          </p>
        </div>
        <button className="bg-teal-600 rounded-md px-6 py-2 my-12 text-white">
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
