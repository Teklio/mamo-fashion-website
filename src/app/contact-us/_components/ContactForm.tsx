"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { useContactUs } from "@/services/settings.service";
import { contactFormSchema, type ContactFormType } from "@/zodschemas/common.schema";

export default function ContactForm() {
  const { mutate: sendMessage, isPending } = useContactUs();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormType>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = (data: ContactFormType) => {
    sendMessage(data, {
      onSuccess: () => {
        toast.success("Message Sent", {
          description: "We've received your message and will get back to you shortly.",
        });
        reset();
      },
      onError: (err) => {
        const ae = err as AxiosError<{ message: string }>;
        toast.error(ae.response?.data?.message || "Failed to send message. Please try again.");
      },
    });
  };

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto mb-20">
      <div className="flex flex-col lg:flex-row gap-16 items-center bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-zinc-100 p-8 md:p-12">

        {/* Left Side: Image */}
        <div className="w-full lg:w-5/12 relative h-96 md:h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 bg-zinc-900/10 z-10 group-hover:bg-transparent transition-colors duration-700"></div>
          <Image
            src="/images/churidar.jpg"
            alt="EVORIA FASHION Contact"
            fill
            className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-7/12 flex flex-col pt-4">
          <span className="text-[10px] tracking-[0.4em] text-zinc-400 font-sans font-semibold uppercase mb-4">
            WRITE TO US
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-4 font-light">
            Send a Message
          </h2>
          <p className="text-zinc-500 font-sans tracking-wide mb-12 max-w-lg leading-relaxed">
            Whether you have a question about our collections, need styling advice, or just want to say hello, we'd love to hear from you.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col relative">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  {...register("fullName")} 
                  className="w-full bg-transparent border-b border-zinc-200 focus:border-zinc-900 focus:outline-none py-3 text-sm transition-colors text-zinc-900 placeholder:text-zinc-400 peer"
                />
                <span className="absolute bottom-0 left-0 w-0 h-px bg-zinc-900 transition-all duration-300 peer-focus:w-full"></span>
                {errors.fullName && (
                  <p className="mt-2 text-[10px] uppercase tracking-wider text-red-500">{errors.fullName.message}</p>
                )}
              </div>

              <div className="flex flex-col relative">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  {...register("email")} 
                  className="w-full bg-transparent border-b border-zinc-200 focus:border-zinc-900 focus:outline-none py-3 text-sm transition-colors text-zinc-900 placeholder:text-zinc-400 peer"
                />
                <span className="absolute bottom-0 left-0 w-0 h-px bg-zinc-900 transition-all duration-300 peer-focus:w-full"></span>
                {errors.email && (
                  <p className="mt-2 text-[10px] uppercase tracking-wider text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col relative">
              <input 
                type="text" 
                placeholder="Subject" 
                {...register("subject")} 
                className="w-full bg-transparent border-b border-zinc-200 focus:border-zinc-900 focus:outline-none py-3 text-sm transition-colors text-zinc-900 placeholder:text-zinc-400 peer"
              />
              <span className="absolute bottom-0 left-0 w-0 h-px bg-zinc-900 transition-all duration-300 peer-focus:w-full"></span>
              {errors.subject && (
                <p className="mt-2 text-[10px] uppercase tracking-wider text-red-500">{errors.subject.message}</p>
              )}
            </div>

            <div className="flex flex-col relative">
              <textarea
                placeholder="Your message..."
                {...register("message")}
                className="w-full bg-transparent border-b border-zinc-200 focus:border-zinc-900 focus:outline-none py-3 text-sm transition-colors text-zinc-900 placeholder:text-zinc-400 min-h-[120px] resize-y peer"
              />
              <span className="absolute bottom-0 left-0 w-0 h-px bg-zinc-900 transition-all duration-300 peer-focus:w-full"></span>
              {errors.message && (
                <p className="mt-2 text-[10px] uppercase tracking-wider text-red-500">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full md:w-auto md:px-12 bg-zinc-900 hover:bg-black text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase py-5 rounded-full mt-4 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.25)] hover:-translate-y-1 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"></span>
              <span className="relative flex justify-center items-center">
                {isPending ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "SEND MESSAGE"
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
