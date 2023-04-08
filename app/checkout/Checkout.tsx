"use client";

import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCartStore } from "@/app/hooks/useCartStore";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function Checkout() {
  const cartStore = useCartStore();
  const [clientSecret, setClientSecret] = useState("");

  const router = useRouter();

  useEffect(() => {
    axios
      .post("/api/create-payment-intent", {
        items: cartStore.cart,
        payment_intent_id: cartStore.paymentIntent,
      })
      .then((res) => {
        if (res.status === 403) {
          return router.push("/api/auth/signin");
        }
        return res.data;
      })
      .then((data) => {
        setClientSecret(data.paymentIntent.client_secret);
        cartStore.setPaymentIntent(data.paymentIntent.id);
      });
  }, [
    cartStore,
    cartStore.cart,
    cartStore.cart.length,
    cartStore.paymentIntent,
    router,
  ]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  return (
    <>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </>
  );
}
