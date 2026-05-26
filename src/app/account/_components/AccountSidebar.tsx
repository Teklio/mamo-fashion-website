"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiUser, FiBox, FiMapPin, FiLogOut } from "react-icons/fi";
import { toast } from "sonner";
import LogoutModal from "./LogoutModal";

const navItems = [
  { name: "Account Details", href: "/account", icon: FiUser },
  { name: "Orders", href: "/account/orders", icon: FiBox },
  { name: "Address Info", href: "/account/address", icon: FiMapPin },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    toast("Logged Out", {
      description: "You have been successfully logged out of your account.",
    });
    router.push("/login");
  };

  return (
    <>
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
        {/* Profile Header */}
        <div className="flex flex-col border border-black/10 rounded-xl p-6 bg-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-serif text-lg">
              AR
            </div>
            <div className="flex flex-col">
              <h2 className="font-serif text-base text-black">Angela R</h2>
              <p className="text-zinc-400 text-xs font-sans">Your Account</p>
            </div>
          </div>
          <div className="w-full h-px bg-black/5 mb-6"></div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-sans transition-colors ${
                    isActive
                      ? "bg-black text-white"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-black"
                  }`}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Log Out */}
          <button 
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-3 px-4 py-3 mt-8 rounded-lg text-sm font-sans text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full text-left"
          >
            <FiLogOut size={16} />
            Log out
          </button>
        </div>
      </div>

      <LogoutModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
