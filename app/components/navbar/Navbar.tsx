"use client";

import { useCartStore } from "@/app/hooks/useCartStore";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cart from "../../cart/Cart";
import { AiFillShopping } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar({ user }: Session) {
  const router = useRouter();
  const cartStore = useCartStore();

  return (
    <nav className="flex justify-between items-center py-8">
      <h1 onClick={() => router.push("/")} className=" text-2xl cursor-pointer">
        Navbar
      </h1>
      <ul className="flex items-center gap-12">
        <li
          onClick={() => cartStore.toggleCart()}
          className="flex items-center text-3l relative cursor-pointer "
        >
          <AnimatePresence key={Math.random()}>
            <AiFillShopping size={32} />
            {cartStore.cart.length > 0 ? (
              <motion.span
                key={Math.random()}
                animate={{ scale: 1 }}
                initial={{ scale: 0 }}
                exit={{ scale: 0 }}
                className="bg-teal-700 text-white text-sm font-bold w-5 h-5 rounded-full absolute bottom-4 left-4 flex items-center justify-center"
              >
                {cartStore.cart.length}
              </motion.span>
            ) : (
              <></>
            )}
          </AnimatePresence>
        </li>
        {user ? (
          <li>
            <Image
              src={user?.image as string}
              alt={user?.name as string}
              width={36}
              height={36}
              className="rounded-full"
            />
          </li>
        ) : (
          <li>
            <button
              className="bg-teal-600 rounded-md px-4 py-2 text-white"
              onClick={() => signIn("google")}
            >
              Sign in
            </button>
          </li>
        )}
      </ul>
      <AnimatePresence>{cartStore.isOpen && <Cart />}</AnimatePresence>
    </nav>
  );
}
