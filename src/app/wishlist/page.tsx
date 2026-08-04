import { Metadata } from "next";
import Header from "@/components/Header";
import WishlistClient from "./_components/WishlistClient";

export const metadata: Metadata = {
  title: "My Wishlist | Mamo Fashion",
  description: "View your saved styles and favorite ethnic wear items at Mamo Fashion. Keep track of the premium dresses and churidars you love.",
};

export default function WishlistPage() {
  return (
    <>
      <Header theme="light" />
      <main className="min-h-screen mt-0 md:mt-10 pt-32 pb-24 bg-white text-zinc-950">
        <WishlistClient />
      </main>
    </>
  );
}
