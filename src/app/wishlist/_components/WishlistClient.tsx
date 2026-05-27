"use client";

import Link from "next/link";
import Image from "next/image";
import { FiX, FiShoppingCart } from "react-icons/fi";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistClient() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.priceVal,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleMoveAllToBag = () => {
    wishlistItems.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.priceVal,
        image: item.image,
      });
    });
    toast.success("All items added to cart");
  };

  const subtotal = wishlistItems.reduce((acc, item) => acc + item.priceVal, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="mb-10">
        <h1 className="text-4xl font-serif text-zinc-900">
          Wishlist
        </h1>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-t border-zinc-100">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
            <FiShoppingCart className="text-zinc-300" size={32} />
          </div>
          <h2 className="text-2xl font-serif text-zinc-900 mb-4">Your wishlist is empty</h2>
          <p className="text-zinc-500 font-sans mb-8 max-w-md">
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
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="flex flex-col md:flex-row border border-[#ebebeb] rounded-xl overflow-hidden bg-[#fafafa]"
                >
                  {/* Image */}
                  <div className="w-full md:w-70 bg-white shrink-0 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-[#ebebeb]">
                    <div className="relative w-full aspect-4/3 md:aspect-square">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col relative">
                    <button
                      onClick={() => {
                        removeFromWishlist(item.id);
                        toast.info(`${item.name} removed from wishlist`);
                      }}
                      className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <FiX size={18} />
                    </button>

                    <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-sans mb-3">
                      FOOTWEAR
                    </span>
                    
                    <h3 className="text-2xl font-serif text-zinc-900 mb-6 pr-8">
                      {item.name}
                    </h3>

                    <div className="flex items-center space-x-2 mb-8 border-b border-[#ebebeb] pb-6">
                      <div className="w-3 h-3 rounded-full bg-yellow-400 border border-zinc-200"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-500 border border-zinc-200 -ml-1"></div>
                      <span className="text-xs text-zinc-600 font-sans ml-2">Ocean blue &amp; Yellow</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div>
                        <span className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-sans mb-2">SIZE</span>
                        <span className="text-sm font-sans text-zinc-900">EU 38</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-sans mb-2">PRICE</span>
                        <span className="text-sm font-sans text-zinc-900">{item.priceText}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-auto">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-8 py-3.5 bg-[#141414] text-white text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-md hover:bg-black transition-colors font-sans"
                      >
                        MOVE TO BAG
                      </button>
                      <button
                        onClick={() => {
                          removeFromWishlist(item.id);
                          toast.info(`${item.name} removed from wishlist`);
                        }}
                        className="px-4 py-3.5 text-[10px] md:text-xs font-bold tracking-widest text-zinc-400 hover:text-zinc-900 uppercase transition-colors font-sans"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-100 shrink-0">
            <div className="border border-[#ebebeb] rounded-xl p-8 bg-[#fafafa]">
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-sans block mb-3">
                SUMMARY
              </span>
              <h2 className="text-3xl font-serif text-zinc-900 mb-8">
                Wishlist Summary
              </h2>
              
              <div className="border-t border-[#ebebeb] pt-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs text-zinc-500 font-sans">Saved items</span>
                  <span className="text-sm text-zinc-900 font-sans font-medium">{wishlistItems.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500 font-sans">Estimated subtotal</span>
                  <span className="text-sm font-semibold text-zinc-900 font-sans">AED {subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-10">
                <button
                  onClick={handleMoveAllToBag}
                  className="w-full py-4 bg-[#141414] text-white text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-md hover:bg-black transition-colors font-sans"
                >
                  MOVE ALL TO BAG
                </button>
                <Link
                  href="/shop"
                  className="w-full py-4 bg-white border border-[#ebebeb] text-zinc-800 text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-md hover:bg-zinc-50 hover:border-zinc-200 transition-colors font-sans text-center block"
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
