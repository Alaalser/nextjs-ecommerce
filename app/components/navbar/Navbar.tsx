"use client";

import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Navbar({ user }: Session) {
  return (
    <nav
      className="
    flex
    justify-between
    items-center
    "
    >
      <h1>Navbar</h1>
      <ul className="items-center gap-12">
        {user ? (
          <li>
            <Image
              src={user?.image as string}
              alt={user?.name as string}
              width={50}
              height={50}
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
    </nav>
  );
}
