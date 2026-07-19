"use client";

interface PhoneInputProps {
  value?: string;
  onChange: (phone: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

// The server stores a bare 10-digit national number, so this is a plain numeric
// input (no country-code prefix). Non-digits are stripped and the value is
// capped at 10 digits.
export function PhoneInput({
  value = "",
  onChange,
  label,
  placeholder = "9876543210",
  error,
  disabled = false,
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    onChange(digits);
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

      <input
        type="tel"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-zinc-100 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none rounded-md px-4 py-3 text-sm transition-colors text-black placeholder:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default PhoneInput;
