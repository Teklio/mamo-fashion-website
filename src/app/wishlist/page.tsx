import { Metadata } from "next";
import Header from "@/components/Header";
import WishlistClient from "./_components/WishlistClient";

export const metadata: Metadata = {
  title: "Wishlist | SORIN",
  description: "View your saved styles and favorites at SORIN.",
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
