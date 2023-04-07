"use client";

import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCartStore } from "@/app/hooks/useCartStore";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const cartStore = useCartStore();
  const [isCartEmpty, setIsCartEmpty] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (cartStore.cart.length === 0) {
      setIsCartEmpty("Your cart is empty");
    }
    axios
      .post("/api/payment", {
        items: cartStore.cart,
        payment_intent_id: cartStore.paymentIntent,
      })
      .then((res) => {
        if (res.status === 403) {
          return router.push("/api/auth/signin");
        }
        return res;
      });
  }, [cartStore.cart, cartStore.cart.length, cartStore.paymentIntent]);

  return <div>cart</div>;
}
