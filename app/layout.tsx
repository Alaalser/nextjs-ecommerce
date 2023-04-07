import Navbar from "./components/navbar/Navbar";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

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
      <body className="mx-64">
        <Navbar user={session?.user} expires={session?.expires as string} />
        {children}
      </body>
    </html>
  );
}
