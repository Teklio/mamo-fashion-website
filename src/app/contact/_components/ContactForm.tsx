"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import Input from "@/components/Input";
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
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-16 items-start">

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h2 className="text-3xl md:text-4xl font-serif text-black mb-2">
            Send us a Message
          </h2>
          <p className="text-zinc-500 font-serif mb-10 text-sm">
            We typically respond within 24 hours
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6 w-full">
            <div className="flex flex-col">
              <Input label="FULL NAME" type="text" placeholder="Your name" {...register("fullName")} />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <Input label="EMAIL" type="email" placeholder="your@email.com" {...register("email")} />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <Input label="SUBJECT" type="text" placeholder="What is this about?" {...register("subject")} />
              {errors.subject && (
                <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] tracking-[0.2em] text-zinc-400 font-sans font-semibold uppercase mb-2">
                MESSAGE
              </label>
              <textarea
                placeholder="Your message..."
                {...register("message")}
                className="w-full bg-zinc-100 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none rounded-md px-4 py-3 text-sm transition-colors text-black placeholder:text-zinc-400 min-h-37.5 resize-y"
              />
              {errors.message && (
                <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#111] hover:bg-black text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase py-4 rounded-lg mt-4 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-12.5"
            >
              {isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "SEND MESSAGE"
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Image */}
        <div className="w-full md:w-1/2 relative h-125 md:h-162.5 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/assets/about/2.jpg"
            alt="SORIN Lifestyle"
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
