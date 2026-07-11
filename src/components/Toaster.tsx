"use client";

import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster 
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "bg-[#111] text-white border border-[#333] shadow-xl rounded-md px-5 py-4",
          title: "text-xs tracking-[0.1em] font-sans font-semibold uppercase",
          description: "text-[11px] tracking-wide text-zinc-400 font-sans mt-1",
        },
      }}
    />
  );
}
