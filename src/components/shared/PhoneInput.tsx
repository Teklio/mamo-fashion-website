"use client";

import { useState, useMemo } from "react";
import { SearchableDropdown } from "./SearchableDropdown";
import { useGetPhonecodes } from "@/services/settings.service";

interface PhoneInputProps {
  value?: string;
  onChange: (fullPhone: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function PhoneInput({
  value = "",
  onChange,
  label,
  placeholder = "50 123 4567",
  error,
  disabled = false,
}: PhoneInputProps) {
  const { data, isLoading } = useGetPhonecodes();

  const phoneOptions = useMemo(
    () =>
      (data?.phonecodes ?? []).map((p) => ({
        value: p.phonecode.startsWith("+") ? p.phonecode : `+${p.phonecode}`,
        label: `${p.phonecode.startsWith("+") ? p.phonecode : `+${p.phonecode}`} (${p.name})`,
      })),
    [data],
  );

  // Parse the incoming combined value into code + number
  const parseValue = (combined: string): { code: string; number: string } => {
    if (!combined) return { code: "+971", number: "" };
    const codes = (data?.phonecodes ?? [])
      .map((p) => (p.phonecode.startsWith("+") ? p.phonecode : `+${p.phonecode}`))
      .sort((a, b) => b.length - a.length); // longest-first to avoid partial matches
    for (const code of codes) {
      if (combined.startsWith(code)) {
        return { code, number: combined.slice(code.length) };
      }
    }
    return { code: "+971", number: combined };
  };

  const parsed = parseValue(value);
  const [phoneCode, setPhoneCode] = useState(parsed.code);
  const [phoneNumber, setPhoneNumber] = useState(parsed.number);

  const handleCodeChange = (code: string) => {
    setPhoneCode(code);
    onChange(phoneNumber.trim() ? code + phoneNumber.trim() : "");
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value;
    setPhoneNumber(num);
    onChange(num.trim() ? phoneCode + num.trim() : "");
  };

  return (
    <div>
      {label && (
        <div className="mb-2">
          <span className="text-[10px] tracking-[0.2em] text-zinc-600 font-sans font-semibold uppercase">
            {label}
          </span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Phone code dropdown — fixed width */}
        <div className="w-36 shrink-0">
          <SearchableDropdown
            value={phoneCode}
            onChange={handleCodeChange}
            options={phoneOptions}
            placeholder="+971"
            searchPlaceholder="Search country…"
            loading={isLoading}
            disabled={disabled}
          />
        </div>

        {/* Phone number input */}
        <div className="flex-1">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handleNumberChange}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full bg-zinc-100 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none rounded-md px-4 py-3 text-sm transition-colors text-black placeholder:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default PhoneInput;
