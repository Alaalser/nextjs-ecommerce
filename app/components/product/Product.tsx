import Image from "next/image";
import { formatPrice } from "./PriceFormat";

interface IProduct {
  name: string;
  image: string;
  price: number | null;
}

const Product: React.FC<IProduct> = ({ name, image, price }) => {
  return (
    <div className="text-gray-700">
      <Image
        src={image}
        alt={name}
        width={400}
        height={400}
        className="w-full h-80 object-cover"
      />
      <h1>{name}</h1>
      {price ? formatPrice(price) : ""}
    </div>
  );
};

export default Product;
