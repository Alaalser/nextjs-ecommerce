import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/app/lib/prismadb";

interface ICartType {
  reduce(arg0: (acc: number, item: any) => number, arg1: number): unknown;
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

const calculateOrderAmount = (items: ICartType) => {
  const total = items.reduce((acc: number, item: any) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);

  return total;
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
    paymentIntentID: payment_intent_id,
    products: {
      connect: items.map((item: ICartType) => {
        return {
          name: item.name,
          image: item.image,
          id: item.id,
          quantity: item.quantity,
          amount: item.unit_amount,
          description: item.description!.slice(0, 100),
        };
      }),
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
          amount: calculateOrderAmount(items) as number,
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
          amount: calculateOrderAmount(items) as number,
          products: {
            deleteMany: {},
            create: items.map((item: ICartType) => {
              return {
                name: item.name,
                image: item.image,
                id: item.id,
                quantity: item.quantity,
                amount: item.unit_amount,
                description: item.description!.slice(0, 100),
              };
            }),
          },
        },
      });
      res.status(200).json({ paymentIntent: updated_intent });
    }
  } else {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items) as number,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
    orderData.paymentIntentID = paymentIntent.id;
    const newOrder = await prisma.order.create({
      data: orderData as any,
    });
  }
  res.status(200).json({ message: "done" });
  return;
}
