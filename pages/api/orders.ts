import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const user = await getServerSession(req, res, authOptions);
    try {
      if (!user) {
        res.status(403).json({ error: "Unauthorized" });
        return;
      }

      const orders = await prisma.order.findMany({
        where: {
          userId: user?.user?.id,
        },
        include: {
          products: true,
        },
      });
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
}
