"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { formatPrice } from "../components/product/PriceFormat";
import { useCartStore } from "../hooks/useCartStore";

interface ICheckoutForm {
  clientSecret: string;
}

const CheckoutForm: React.FC<ICheckoutForm> = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const cartStore = useCartStore();

  const totalPrice = cartStore.cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!;
  }, 0);

  const formattedPrice = formatPrice(totalPrice);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
  }, [stripe, clientSecret]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!stripe || !elements) {
        return;
      }
      setIsLoading(true);
      stripe
        .confirmPayment({
          elements,
          redirect: "if_required",
        })
        .then((result) => {
          if (!result.error) {
            cartStore.setCheckout("success");
          }
          setIsLoading(false);
        });
    },
    [cartStore, elements, stripe]
  );

  return (
    <form onSubmit={handleSubmit} id="payment-form" className=" text-gray-600">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <h1 className="py-4 text-sm font-bold">Total:{formattedPrice} </h1>
      <button
        className={`py-2 mt-4 w-full bg-teal-700 rounded-md text-white disabled:opacity-25`}
        id="submit"
        disabled={!stripe || !elements || isLoading}
      >
        <span id="button-text">
          {isLoading ? <div className="text-gray-800">Loading</div> : "Pay"}
        </span>
      </button>
    </form>
  );
};

export default CheckoutForm;
