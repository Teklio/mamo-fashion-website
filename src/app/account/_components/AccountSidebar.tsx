"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiUser, FiBox, FiMapPin, FiLogOut } from "react-icons/fi";
import { toast } from "sonner";
import LogoutModal from "./LogoutModal";
import { useLogout } from "@/services/auth.service";
import type { AxiosError } from "axios";

const navItems = [
  { name: "Account Details", href: "/account", icon: FiUser },
  { name: "Orders", href: "/account/orders", icon: FiBox },
  { name: "Address Info", href: "/account/address", icon: FiMapPin },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setIsLogoutModalOpen(false);
        toast.success("Logged out successfully");
        router.push("/");
      },
      onError: (err) => {
        const axiosErr = err as AxiosError<{ message: string }>;
        toast.error(axiosErr.response?.data?.message || "Logout failed");
        setIsLogoutModalOpen(false);
      },
    });
  };

  return (
    <>
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
        {/* Profile Header */}
        <div className="flex flex-col border border-black/10 rounded-xl p-4 md:p-6 bg-white">
          <div className="flex items-center gap-4 mb-4 md:mb-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black text-white rounded-full flex items-center justify-center font-serif text-base md:text-lg shrink-0">
              AR
            </div>
            <div className="flex flex-col">
              <h2 className="font-serif text-sm md:text-base text-black">Angela R</h2>
              <p className="text-zinc-400 text-[10px] md:text-xs font-sans">Your Account</p>
            </div>
          </div>
          <div className="w-full h-px bg-black/5 mb-4 md:mb-6"></div>

          {/* Navigation */}
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs md:text-sm font-sans transition-colors whitespace-nowrap ${isActive
                      ? "bg-black text-white"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-black bg-zinc-50/50 lg:bg-transparent"
                    }`}
                >
                  <Icon size={14} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Log Out */}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center justify-center lg:justify-start gap-2.5 px-4 py-2.5 mt-4 lg:mt-8 rounded-lg text-xs md:text-sm font-sans text-red-500 hover:text-red-600 hover:bg-red-50/40 bg-red-50/20 lg:bg-transparent transition-colors w-full text-center lg:text-left"
          >
            <FiLogOut size={14} />
            Log out
          </button>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
}
