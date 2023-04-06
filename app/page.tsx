import Stripe from "stripe";
import Product from "./components/Product";
const getProducts = async () => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15",
  });
  const products = await stripe.products.list();

  const productsWithPrices = await Promise.all(
    products.data.map(async (product) => {
      const prices = await stripe.prices.list({
        product: product.id,
      });
      return {
        id: product.id,
        name: product.name,
        prices: prices.data[0].unit_amount,
        image: product.images[0],
        currency: prices.data[0].currency,
        metadata: product.metadata,
      };
    })
  );
  return productsWithPrices;
};
export default async function Home() {
  const products = await getProducts();
  console.log(products);

  return (
    <main>
      {products.map((product) => (
        <Product
          image={product.image}
          price={product.prices as number}
          key={product.id}
          name={product.name}
        />
      ))}
    </main>
  );
}
