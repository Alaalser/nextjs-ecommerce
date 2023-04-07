import ProductCard from "./components/product/ProductCard";
import getProducts from "./actions/getProducts";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="grid grid-cols-fluid gap-16">
      {products.map((product) => (
        <ProductCard
          id={product.id}
          image={product.image}
          unit_amount={product.unit_amount as number}
          key={product.id}
          name={product.name}
          metadata={product.metadata}
          description={product.description}
        />
      ))}
    </main>
  );
}
