import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/app/lib/prismadb";

interface ICartType {
  name: string;
  image: string;
  id: string;
  quantity: number | 1;
  unit_amount: number | null;
  description?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const calculateOrderAmount = (items: ICartType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);

  return totalPrice;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userSession = await getServerSession(req, res, authOptions);

  if (!userSession) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { items, payment_intent_id } = req.body;

  const orderData = {
    user: {
      connect: {
        id: userSession.user?.id,
      },
    },
    amount: calculateOrderAmount(items),
    currency: "usd",
    status: "pending",
    paymentIntentId: payment_intent_id,
    products: {
      create: items.map((item: ICartType) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        unit_amout: parseFloat(item.unit_amount as any),
        description: item.description!,
      })),
    },
  };

  if (payment_intent_id) {
    const current_intent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (current_intent) {
      const updated_intent = await stripe.paymentIntents.update(
        payment_intent_id,
        {
          amount: calculateOrderAmount(items),
        }
      );
      const existing_order = await prisma.order.findFirst({
        where: { paymentIntentId: payment_intent_id },
        include: {
          products: true,
        },
      });
      if (!existing_order) {
        res.status(400).json({ message: "invaild order" });
      }

      const updated_order = await prisma.order.update({
        where: { id: existing_order?.id },
        data: {
          amount: calculateOrderAmount(items),
          products: {
            deleteMany: {},
            create: items.map((item: ICartType) => {
              return {
                name: item.name,
                image: item.image,
                id: item.id,
                quantity: item.quantity,
                unit_amout: parseFloat(item.unit_amount as any),
                description: item.description!,
              };
            }),
          },
        },
      });
      res.status(200).json({ paymentIntent: updated_intent });
    }
  } else {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    orderData.paymentIntentId = paymentIntent.id;
    const newOrder = await prisma.order.create({
      data: orderData as any,
    });
    res.status(200).json({ paymentIntent });
  }
}
