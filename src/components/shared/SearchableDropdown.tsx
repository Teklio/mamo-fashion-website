"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  FiChevronDown,
  FiSearch,
  FiX,
  FiCheck,
} from "react-icons/fi";

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  loading?: boolean;
  onSearchChange?: (q: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

export function SearchableDropdown({
  value,
  onChange,
  options,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  disabled = false,
  loading = false,
  onSearchChange,
  label,
  error,
  className = "",
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
        onSearchChange?.("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-focus search when opened
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => searchRef.current?.focus(), 40);
    return () => clearTimeout(t);
  }, [isOpen]);

  const handleQueryChange = (q: string) => {
    setQuery(q);
    onSearchChange?.(q);
  };

  const displayedOptions = useMemo(() => {
    // Server-side search: parent owns filtering
    if (onSearchChange) return options;
    if (!query.trim()) return options;
    const lower = query.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(lower) ||
        (o.description ?? "").toLowerCase().includes(lower),
    );
  }, [options, query, onSearchChange]);

  const select = (opt: Option) => {
    onChange(opt.value);
    setIsOpen(false);
    setQuery("");
    onSearchChange?.("");
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setIsOpen(false);
    setQuery("");
    onSearchChange?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      onSearchChange?.("");
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      {/* Label */}
      {label && (
        <div className="mb-2">
          <span className="text-[10px] tracking-[0.2em] text-zinc-600 font-sans font-semibold uppercase">
            {label}
          </span>
        </div>
      )}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`
          w-full flex items-center justify-between gap-2
          bg-zinc-100 border text-sm rounded-md px-4 py-3
          transition-colors duration-150 text-left
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-zinc-50"}
          ${isOpen ? "border-zinc-300 bg-white" : "border-transparent"}
          ${error ? "border-red-300" : ""}
        `}
      >
        <span
          className={`truncate flex-1 ${
            selectedOption ? "text-black" : "text-zinc-400"
          }`}
        >
          {selectedOption
            ? selectedOption.label
            : placeholder}
        </span>

        <span className="flex items-center gap-1 shrink-0">
          {value && !disabled && (
            <span
              onClick={clear}
              className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-zinc-200 transition-colors"
              aria-label="Clear"
            >
              <FiX size={11} className="text-zinc-400" />
            </span>
          )}
          <FiChevronDown
            size={14}
            className={`text-zinc-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-black/10 rounded-md shadow-lg overflow-hidden"
          style={{
            animation: "dropdownFadeIn 0.12s ease-out",
          }}
        >
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-zinc-50 border-b border-black/6">
            <FiSearch size={13} className="text-zinc-400 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm outline-none text-black placeholder:text-zinc-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange("")}
                className="shrink-0"
              >
                <FiX size={12} className="text-zinc-400 hover:text-zinc-600 transition-colors" />
              </button>
            )}
          </div>

          {/* Options */}
          <div className="max-h-56 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-6 text-center text-xs text-zinc-400 font-sans">
                Loading…
              </div>
            ) : displayedOptions.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-zinc-400 font-sans">
                No results found
              </div>
            ) : (
              displayedOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={`${opt.value}__${opt.label}`}
                    type="button"
                    onClick={() => select(opt)}
                    className={`
                      w-full flex items-center justify-between gap-3
                      px-4 py-2.5 text-left text-sm transition-colors duration-100
                      ${isSelected
                        ? "bg-zinc-100 text-black font-semibold"
                        : "text-zinc-700 hover:bg-zinc-50 hover:text-black"
                      }
                    `}
                  >
                    <span className="flex flex-col min-w-0">
                      <span className="truncate">{opt.label}</span>
                      {opt.description && (
                        <span className="text-[11px] text-zinc-400 font-normal truncate mt-0.5">
                          {opt.description}
                        </span>
                      )}
                    </span>
                    {isSelected && (
                      <FiCheck size={13} className="text-black shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}

      <style>{`
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default SearchableDropdown;
