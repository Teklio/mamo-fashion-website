"use client";

import Link from "next/link";
import Image from "next/image";
import { FiX, FiShoppingCart } from "react-icons/fi";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGetWishlist, useRemoveFromWishlist } from "@/services/wishlist.service";
import { useAddToCart } from "@/services/cart.service";
import { formatPrice } from "@/services/product.service";
import type { WishlistItem } from "@/types/wishlist.type";

export default function WishlistClient() {
  const router = useRouter();
  const { data, isLoading } = useGetWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { mutate: addToCart } = useAddToCart();

  const wishlist = data?.wishlist ?? [];
  const subtotal = wishlist.reduce(
    (acc: number, w: WishlistItem) => acc + Number(w.variant?.product?.price ?? 0),
    0,
  );

  const handleMoveToCart = () => {
    let added = 0;
    wishlist.forEach((w) => {
      const availableSize = w.variant?.sizes?.find(s => s.stock > 0);
      if (availableSize) {
        addToCart({ productVariantSizeId: availableSize.id, quantity: 1 });
        added++;
        // Optionally remove from wishlist here if desired, but we'll leave it for now
      }
    });
    
    if (added > 0) {
      toast.success(`${added} items moved to cart!`);
      router.push("/cart");
    } else {
      toast.error("No items have available sizes in stock.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-400 mx-auto px-8 md:px-16">
        <div className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-serif text-zinc-900">Wishlist</h1>
        </div>
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-400 mx-auto px-8 md:px-16">
      <div className="mb-8 md:mb-10">
        <h1 className="text-2xl md:text-4xl font-serif text-zinc-900">Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-t border-zinc-100">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
            <FiShoppingCart className="text-zinc-300" size={32} />
          </div>
          <h2 className="text-2xl font-serif text-zinc-900 mb-4">Your wishlist is empty</h2>
          <p className="text-zinc-500 font-sans mb-8 max-w-md text-xs sm:text-sm">
            Save your favorite styles and come back to them later.
          </p>
          <Link
            href="/shop"
            className="px-8 py-4 bg-zinc-900 text-white text-xs font-bold font-sans tracking-[0.2em] rounded-sm hover:bg-black transition-colors inline-block"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 border-t border-zinc-100 pt-8">
          {/* Left: Product List */}
          <div className="flex-1 flex flex-col gap-6">
            <AnimatePresence>
              {wishlist.map((w: WishlistItem) => {
                const variant = w.variant;
                const product = variant?.product;
                const imageUrl = variant?.primaryImage?.publicUrl ?? "";

                return (
                  <motion.div
                    key={w.variantId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    className="flex flex-col md:flex-row border border-[#ebebeb] rounded-xl overflow-hidden bg-[#fafafa]"
                  >
                    {/* Image */}
                    <Link
                      href={`/shop/${variant?.productId}`}
                      className="w-full md:w-48 bg-white shrink-0 flex items-center justify-center p-4 md:p-6 border-b md:border-b-0 md:border-r border-[#ebebeb] hover:bg-zinc-50 transition-colors"
                    >
                      <div className="relative w-full aspect-video md:aspect-square">
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={product?.title ?? ""}
                            fill
                            className="object-contain"
                          />
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 p-4 md:p-5 flex flex-col relative">
                      <button
                        onClick={() => {
                          removeFromWishlist(w.variantId, {
                            onSuccess: () =>
                              toast.info(`${product?.title} removed from wishlist`),
                          });
                        }}
                        className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <FiX size={18} />
                      </button>

                      <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-sans mb-1.5">
                        FOOTWEAR
                      </span>

                      <h3 className="text-xl md:text-2xl font-serif text-zinc-900 mb-2.5 pr-8 hover:text-zinc-600 transition-colors">
                        <Link href={`/shop/${variant?.productId}`}>{product?.title}</Link>
                      </h3>

                      <div className="flex items-center space-x-2 mb-3 border-b border-[#ebebeb] pb-3">
                        <div
                          className="w-3 h-3 rounded-full border border-zinc-200"
                          style={{ backgroundColor: variant?.colorCode ?? "#31639d" }}
                        />
                        <span className="text-xs text-zinc-600 font-sans ml-2">
                          {variant?.colorName ?? ""}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-semibold text-zinc-900 font-sans">
                          {formatPrice(product?.price ?? "0")}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-auto">
                        <Link
                          href={`/shop/${variant?.productId}`}
                          className="px-6 py-3 bg-[#141414] text-white text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-md hover:bg-black transition-colors font-sans"
                        >
                          VIEW PRODUCT
                        </Link>
                        <button
                          onClick={() => {
                            removeFromWishlist(w.variantId, {
                              onSuccess: () =>
                                toast.info(`${product?.title} removed from wishlist`),
                            });
                          }}
                          className="px-4 py-3 text-[10px] md:text-xs font-bold tracking-widest text-zinc-400 hover:text-zinc-900 uppercase transition-colors font-sans"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-100 shrink-0">
            <div className="border border-[#ebebeb] rounded-xl p-5 md:p-8 bg-[#fafafa]">
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-sans block mb-3">
                SUMMARY
              </span>
              <h2 className="text-2xl md:text-3xl font-serif text-zinc-900 mb-6 md:mb-8">
                Wishlist Summary
              </h2>

              <div className="border-t border-[#ebebeb] pt-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs text-zinc-500 font-sans">Saved items</span>
                  <span className="text-sm text-zinc-900 font-sans font-medium">{wishlist.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500 font-sans">Estimated subtotal</span>
                  <span className="text-sm font-semibold text-zinc-900 font-sans">
                    INR {subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-8 md:mt-10">
                <button
                  onClick={handleMoveToCart}
                  className="w-full py-3.5 md:py-4 bg-[#111] border border-[#111] text-white text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-md hover:bg-black transition-colors font-sans text-center block"
                >
                  PROCEED TO CART
                </button>
                <Link
                  href="/shop"
                  className="w-full py-3.5 md:py-4 bg-white border border-[#ebebeb] text-zinc-800 text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-md hover:bg-zinc-50 hover:border-zinc-200 transition-colors font-sans text-center block"
                >
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
