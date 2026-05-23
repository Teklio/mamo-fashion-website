"use client";

import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import { toast } from "sonner";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount } = useCart();

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);



  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden text-zinc-950 pt-32 pb-24">
      <Header theme="light" />
      
      <div className="max-w-7xl mx-auto mt-0 md:mt-10 px-6 md:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 border-b border-zinc-100 pb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-black">Shopping Cart</h1>
          <span className="text-[10px] tracking-[0.2em] font-sans font-semibold text-zinc-400 uppercase mt-4 md:mt-0">
            {cartCount} {cartCount === 1 ? "PIECE" : "PIECES"}
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center border border-zinc-100 rounded-3xl bg-zinc-50/50">
            <h2 className="font-serif text-2xl text-black mb-4">Your cart is empty</h2>
            <p className="text-zinc-500 font-serif mb-8 text-sm">Looks like you haven&apos;t added anything to your cart yet.</p>
            <Link href="/shop" className="bg-[#111] hover:bg-black transition-colors text-white px-8 py-4 rounded-md text-xs tracking-widest font-sans uppercase font-semibold">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            
            {/* Left Column: Cart Items */}
            <div className="w-full lg:w-[60%] flex flex-col">
              {cartItems.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-black/20 rounded-4xl p-4 md:p-6 mb-6 bg-white shadow-[0_2px_20px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_20px_-10px_rgba(0,0,0,0.06)] transition-shadow">
                  
                  {/* Left: Image + Info */}
                  <div className="flex items-center gap-6 mb-6 sm:mb-0">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 bg-[#f5f5f5] rounded-xl overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-serif text-lg md:text-xl text-black mb-1">{item.name}</h3>
                      <p className="text-[10px] text-zinc-400 font-sans mb-3 tracking-wider">Footwear</p>
                      <p className="text-[10px] text-zinc-500 font-sans tracking-widestuppercase font-semibold">
                        SIZE - EU 35
                      </p>
                    </div>
                  </div>

                  {/* Right: Quantity, Price, Delete */}
                  <div className="flex items-center gap-6 md:gap-10 w-full sm:w-auto justify-between sm:justify-end">
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-zinc-200 rounded-full px-4 py-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-zinc-400 hover:text-black transition-colors px-1 focus:outline-none"
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="font-sans text-xs font-semibold text-black w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-zinc-400 hover:text-black transition-colors px-1 focus:outline-none"
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>

                    <p className="font-serif text-lg text-black w-20 text-right">
                      AED {item.price * item.quantity}
                    </p>

                    <button 
                      onClick={() => {
                        removeFromCart(item.id);
                        toast("Item Removed", {
                          description: `${item.name} has been removed from your cart.`,
                        });
                      }}
                      className="text-zinc-300 hover:text-red-500 transition-colors ml-2 focus:outline-none"
                      aria-label="Remove item"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full lg:w-[40%]">
              <div className="border-2 border-black/30 rounded-4xl p-8 lg:p-10 sticky top-32 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.03)] bg-white">
                <h2 className="font-serif text-2xl text-black mb-8">Order Summary</h2>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-500 font-sans text-xs tracking-wider">Subtotal</span>
                  <span className="text-black font-sans text-xs font-semibold">AED {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-500 font-sans text-xs tracking-wider">Shipping</span>
                  <span className="text-black font-sans text-xs font-semibold">Free</span>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-500 font-sans text-xs tracking-wider">Tax</span>
                  <span className="text-black font-sans text-[11px]">Inclusive of duties.</span>
                </div>
                
                <div className="w-full h-px bg-zinc-100 my-8"></div>
                
                <div className="flex justify-between items-center mb-10">
                  <span className="text-black font-sans text-[11px] font-semibold tracking-widest uppercase">TOTAL</span>
                  <span className="text-black font-serif text-xl">AED {subtotal.toFixed(2)}</span>
                </div>
                
                <button className="w-full bg-[#111] hover:bg-black text-white text-[11px] tracking-[0.2em] font-sans font-semibold uppercase py-5 rounded-lg transition-colors shadow-sm">
                  CHECKOUT
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}

