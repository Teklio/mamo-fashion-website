"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  rightLabel?: React.ReactNode;
}

export default function Input({ label, rightLabel, type, className = "", ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <label className="text-[10px] tracking-[0.2em] text-zinc-600 font-sans font-semibold uppercase">
          {label}
        </label>
        {rightLabel && (
          <div className="text-[10px] text-zinc-400 hover:text-black transition-colors">
            {rightLabel}
          </div>
        )}
      </div>
      <div className="relative">
        <input 
          type={inputType}
          className={`w-full bg-zinc-100 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none rounded-md px-4 py-3 text-sm transition-colors text-black placeholder:text-zinc-400 ${className}`}
          suppressHydrationWarning
          {...props}
        />
        {isPassword && (
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
            suppressHydrationWarning
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
