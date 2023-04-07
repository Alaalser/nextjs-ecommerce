import Navbar from "./components/navbar/Navbar";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import ClientOnly from "./components/ClientOnly";
import { Roboto, Lobster_Two } from "next/font/google";

const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"] });

export const metadata = {
  title: "Best Ecommerce ",
  description: "Best Ecommerce ever",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={`mx-24 lg:mx-48 ${roboto.className}`}>
        <ClientOnly>
          <Navbar user={session?.user} expires={session?.expires as string} />
          {children}
        </ClientOnly>
      </body>
    </html>
  );
}
