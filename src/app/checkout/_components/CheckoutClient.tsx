"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FiLock, FiChevronDown, FiCheck } from "react-icons/fi";
import Input from "@/components/Input";
import { toast } from "sonner";
import Header from "@/components/Header";

export default function CheckoutClient() {
  const { cartItems } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [billingAddress, setBillingAddress] = useState("same");

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping: number = 0; // Free shipping
  const total = subtotal + shipping;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity()) {
      toast.error("Please fill in all required fields.");
      form.reportValidity();
      return;
    }
    toast.success("Order placed successfully!");
  };

  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-32">
      <Header theme="light" />

      <div className="flex flex-col-reverse lg:flex-row max-w-400 mx-auto px-8 md:px-16">
        {/* Left Column - Form */}
        <div className="w-full lg:w-3/5 p-6 lg:p-12 lg:pr-24 lg:border-r border-zinc-200/50">

        <form className="space-y-12" onSubmit={handleCheckout}>
          {/* Contact Details */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-black">Your details</h2>
              <Link href="/login" className="text-sm text-zinc-500 hover:text-black transition-colors underline">
                Log in
              </Link>
            </div>
            <div className="space-y-4">
              <Input
                required
                type="email"
                label="Email Address"
                placeholder="EMAIL ADDRESS"
                className="bg-transparent border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-xs tracking-wider uppercase"
              />
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-5 h-5 border border-zinc-300 rounded-sm flex items-center justify-center group-hover:border-black transition-colors bg-black">
                  <FiCheck className="text-white w-3 h-3" />
                </div>
                <span className="text-sm text-zinc-600">Email me with news and exclusive offers</span>
              </label>
            </div>
          </section>

          {/* Shipping Address */}
          <section>
            <h2 className="text-lg font-medium text-black mb-4">Shipping address</h2>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-[10px] tracking-[0.2em] text-zinc-600 font-sans font-semibold uppercase mb-2">
                  Country / Region
                </label>
                <div className="relative">
                  <select required className="w-full bg-transparent border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black rounded-md px-4 py-3 text-xs tracking-wider uppercase transition-colors text-black appearance-none">
                    <option value="">COUNTRY / REGION</option>
                    <option value="ae">United Arab Emirates</option>
                    <option value="sa">Saudi Arabia</option>
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  required
                  type="text"
                  label="First Name"
                  placeholder="FIRST NAME"
                  className="bg-transparent border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-xs tracking-wider uppercase"
                />
                <Input
                  required
                  type="text"
                  label="Last Name"
                  placeholder="LAST NAME"
                  className="bg-transparent border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-xs tracking-wider uppercase"
                />
              </div>

              <Input
                required
                type="text"
                label="Address"
                placeholder="ADDRESS"
                className="bg-transparent border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-xs tracking-wider uppercase"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  required
                  type="text"
                  label="City"
                  placeholder="CITY"
                  className="bg-transparent border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-xs tracking-wider uppercase"
                />
                <div className="flex flex-col">
                  <label className="text-[10px] tracking-[0.2em] text-zinc-600 font-sans font-semibold uppercase mb-2">
                    Emirate
                  </label>
                  <div className="relative">
                    <select required className="w-full bg-transparent border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black rounded-md px-4 py-3 text-xs tracking-wider uppercase transition-colors text-black appearance-none">
                      <option value="">EMIRATE</option>
                      <option value="Dubai">Dubai</option>
                      <option value="Abu Dhabi">Abu Dhabi</option>
                    </select>
                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <Input
                required
                type="tel"
                label="Phone"
                placeholder="PHONE"
                className="bg-transparent border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-xs tracking-wider uppercase"
              />
            </div>
          </section>

          {/* Shipping Method */}
          <section>
            <h2 className="text-lg font-medium text-black mb-4">Shipping method</h2>
            <div className="w-full bg-zinc-50 border border-zinc-200 rounded-sm p-5 flex items-start space-x-4">
              <div className="mt-1 opacity-50">
                {/* Truck icon placeholder */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-black mb-1">Enter your shipping address</h3>
                <p className="text-xs text-zinc-500">Available methods will appear here once we know where to deliver.</p>
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-medium text-black">Payment method</h2>
              <span className="text-[10px] text-zinc-500 flex items-center gap-1 uppercase tracking-wider">
                <FiLock className="w-3 h-3" /> All transactions are secure & encrypted
              </span>
            </div>
            <div className="border border-zinc-300 rounded-sm overflow-hidden bg-transparent divide-y divide-zinc-300">
              {/* Credit Card */}
              <label onClick={() => setPaymentMethod('card')} className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'bg-zinc-50/50' : 'hover:bg-zinc-50/50'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-black' : 'border-zinc-300'}`}>
                    {paymentMethod === 'card' && <div className="w-2 h-2 bg-black rounded-full" />}
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-black">Credit or debit card</span>
                    <span className="block text-xs text-zinc-500 mt-0.5">Visa, Mastercard & American Express via Checkout.com</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {/* Fake card icons */}
                  <div className="w-8 h-5 bg-[#1a1f71] rounded text-[8px] text-white flex items-center justify-center font-bold">VISA</div>
                  <div className="w-8 h-5 bg-[#eb001b] rounded flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#ff5f00] rounded-full -mr-1 mix-blend-screen"></div>
                    <div className="w-3 h-3 bg-[#f79e1b] rounded-full mix-blend-screen"></div>
                  </div>
                  <div className="w-8 h-5 bg-[#2e77bc] rounded text-[6px] text-white flex items-center justify-center font-bold">AMEX</div>
                </div>
              </label>

              {/* Tabby */}
              <label onClick={() => setPaymentMethod('tabby')} className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${paymentMethod === 'tabby' ? 'bg-[#ebfef5]/50' : 'hover:bg-zinc-50/50'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'tabby' ? 'border-black' : 'border-zinc-300'}`}>
                    {paymentMethod === 'tabby' && <div className="w-2 h-2 bg-black rounded-full" />}
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-black">Pay in 4 with Tabby</span>
                    <span className="block text-xs text-zinc-500 mt-0.5">4 interest-free payments of AED {(total / 4).toFixed(2)}</span>
                  </div>
                </div>
                <div className="w-12 h-5 bg-[#3df5a7] rounded flex items-center justify-center text-[10px] font-bold text-black tracking-tighter">
                  tabby
                </div>
              </label>

              {/* Tamara */}
              <label onClick={() => setPaymentMethod('tamara')} className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${paymentMethod === 'tamara' ? 'bg-[#fbe9e7]/50' : 'hover:bg-zinc-50/50'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'tamara' ? 'border-black' : 'border-zinc-300'}`}>
                    {paymentMethod === 'tamara' && <div className="w-2 h-2 bg-black rounded-full" />}
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-black">Split in 3 with Tamara</span>
                    <span className="block text-xs text-zinc-500 mt-0.5">Interest-free & Shariah-compliant</span>
                  </div>
                </div>
                <div className="w-12 h-5 flex items-center justify-center text-[12px] font-bold text-black tracking-tighter">
                  tamara
                </div>
              </label>
            </div>
          </section>

          {/* Billing Address */}
          <section>
            <h2 className="text-lg font-medium text-black mb-4">Billing address</h2>
            <div className="border border-zinc-300 rounded-sm overflow-hidden bg-transparent divide-y divide-zinc-300">
              <label onClick={() => setBillingAddress('same')} className={`flex items-center p-4 cursor-pointer transition-colors ${billingAddress === 'same' ? 'bg-zinc-50/50' : 'hover:bg-zinc-50/50'}`}>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-4 ${billingAddress === 'same' ? 'border-black' : 'border-zinc-300'}`}>
                  {billingAddress === 'same' && <div className="w-2 h-2 bg-black rounded-full" />}
                </div>
                <span className="text-sm text-black">Same as shipping address</span>
              </label>
              <label onClick={() => setBillingAddress('different')} className={`flex items-center p-4 cursor-pointer transition-colors ${billingAddress === 'different' ? 'bg-zinc-50/50' : 'hover:bg-zinc-50/50'}`}>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-4 ${billingAddress === 'different' ? 'border-black' : 'border-zinc-300'}`}>
                  {billingAddress === 'different' && <div className="w-2 h-2 bg-black rounded-full" />}
                </div>
                <span className="text-sm text-black">Use a different billing address</span>
              </label>
            </div>

            {billingAddress === 'different' && (
              <div className="mt-4 space-y-4 p-4 border border-zinc-300 rounded-sm bg-zinc-50/30">
                <Input
                  type="text"
                  label="Address"
                  placeholder="ADDRESS"
                  className="bg-transparent border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-xs tracking-wider uppercase"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    label="City"
                    placeholder="CITY"
                    className="bg-transparent border-zinc-300 focus:border-black focus:ring-1 focus:ring-black text-xs tracking-wider uppercase"
                  />
                  <div className="flex flex-col">
                    <label className="text-[10px] tracking-[0.2em] text-zinc-600 font-sans font-semibold uppercase mb-2">
                      Emirate
                    </label>
                    <div className="relative">
                      <select className="w-full bg-transparent border border-zinc-300 focus:border-black focus:ring-1 focus:ring-black rounded-md px-4 py-3 text-xs tracking-wider uppercase transition-colors text-black appearance-none">
                        <option>EMIRATE</option>
                        <option>Dubai</option>
                        <option>Abu Dhabi</option>
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#111] hover:bg-black text-white px-8 py-4 rounded-sm text-xs font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-3 transition-colors"
            >
              <FiLock className="w-4 h-4" />
              <span>Pay Now - AED {total.toFixed(2)}</span>
            </button>
            <p className="text-center text-[10px] text-zinc-500 mt-4 flex items-center justify-center gap-1">
              <FiLock className="w-3 h-3" /> Your payment information is processed securely
            </p>
          </div>
        </form>

        {/* Footer links */}
        <div className="mt-20 pt-8 border-t border-zinc-200/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <div className="flex gap-4">
            <Link href="/policy" className="hover:text-black transition-colors">Refund policy</Link>
            <Link href="/shipping" className="hover:text-black transition-colors">Shipping</Link>
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
          </div>
          <div>© SORIN — DUBAI, UAE</div>
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="w-full lg:w-2/5 bg-zinc-50/30 lg:bg-white p-6 lg:p-12 lg:pl-12 lg:min-h-screen border-b lg:border-b-0 border-zinc-200/50">
        <div className="max-w-md mx-auto sticky top-12">

          <div className="border border-zinc-200 rounded-sm p-6 bg-white">
            {/* Products List */}
            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 mb-6">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-zinc-100 rounded-sm border border-zinc-200 shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-zinc-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-black truncate">{item.name}</h4>
                      {item.size && <p className="text-xs text-zinc-500 mt-1">Size: {item.size}</p>}
                    </div>
                    <div className="text-sm font-medium text-black whitespace-nowrap">
                      AED {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-500 text-sm">
                  Your cart is empty
                </div>
              )}
            </div>

            <div className="border-t border-zinc-200 pt-6 pb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Discount code"
                  className="flex-1 bg-zinc-50 border border-zinc-200 focus:border-black focus:ring-1 focus:ring-black rounded-sm px-4 py-3 text-sm transition-colors text-black placeholder:text-zinc-500"
                />
                <button type="button" className="px-6 py-3 border border-zinc-300 rounded-sm text-xs font-semibold tracking-wider uppercase text-black hover:bg-zinc-50 transition-colors">
                  Apply
                </button>
              </div>
            </div>

            <div className="border-t border-zinc-200 pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Subtotal</span>
                <span className="text-black font-medium">AED {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Shipping</span>
                <span className="text-black font-medium">{shipping === 0 ? 'Free' : `AED ${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="border-t border-zinc-200 mt-6 pt-6 flex justify-between items-end">
              <span className="text-xs text-zinc-500 tracking-wider uppercase">Total</span>
              <span className="text-2xl font-medium text-black">AED {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
