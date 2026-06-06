"use client";

import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function LogoutModal({ isOpen, onClose, onConfirm, isLoading = false }: LogoutModalProps) {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRendered(true);
      document.body.style.overflow = "hidden";
    } else {
      setTimeout(() => setIsRendered(false), 300); // match transition duration
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen && !isRendered) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div 
        className={`relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center transition-all duration-300 transform ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
          <FiLogOut size={24} className="-ml-1" />
        </div>
        
        <h3 className="font-serif text-2xl text-black mb-2 text-center">Log Out</h3>
        <p className="text-zinc-500 font-sans text-sm text-center mb-8">
          Are you sure you want to log out of your account? You will need to log back in to manage your orders.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-sans font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3.5 px-4 bg-black hover:bg-black/90 text-white text-xs font-sans font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {isLoading ? "Logging out…" : "Yes, Log out"}
          </button>
        </div>
      </div>
    </div>
  );
}
