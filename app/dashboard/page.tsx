import prisma from "@/app/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { formatPrice } from "../components/product/PriceFormat";
import Image from "next/image";

export const revalidate = 0;

const fetchOrders = async () => {
  const user = await getServerSession(authOptions);
  if (!user) {
    return [];
  }

  const orders = await prisma.order.findMany({
    where: { userId: user?.user?.id },
    include: { products: true },
  });
  return orders;
};

const Dashboard = async () => {
  const orders = await fetchOrders();
  console.log(orders);

  return (
    <div>
      {orders ? (
        <h1 className="text-bold">Your orders</h1>
      ) : (
        <h1 className="text-bold">You have no orders</h1>
      )}
      <div>
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg pt-6 my-12">
            <h1 className="text-xs font-medium">Order reference: {order.id}</h1>
            <p className="text-xs">
              Time: {new Date(order.createdDate).toString()}
            </p>
            <p className="text-md py-2">
              Status:
              <span
                className={`${
                  order.status === "complete" ? "bg-teal-500" : "bg-orange-500"
                } text-white py-1 rounded-md px-2 mx-2 text-sm`}
              >
                {order.status}
              </span>
            </p>
            <p className="font-medium"> Total: {formatPrice(order.amount)}</p>
            <div className="lg:flex gap-8 text-sm ">
              {order.products.map((product) => (
                <div className="py-2" key={product.id}>
                  <h1 className="py-2">{product.name}</h1>
                  <div className="flex items-end gap-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={50}
                      height={50}
                    />
                    <p className="font-bold text-teal-700">
                      {product.unit_amout}
                    </p>
                    <p>Quantity: {product.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
