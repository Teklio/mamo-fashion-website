"use client"
import { useState } from "react";
import Input from "@/components/Input";
import { toast } from "sonner";
import { FiLock, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function AccountDetailsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Information Updated", {
        description: "Your account details have been successfully saved.",
      });
    }, 1000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password Updated", {
      description: "Your password has been successfully changed.",
    });
    setIsPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-5 md:p-8 lg:p-10 w-full min-h-150">
      <div className="mb-10">
        <h1 className="font-serif text-xl md:text-2xl lg:text-3xl text-black mb-2">Account Details</h1>
        <p className="text-zinc-500 font-sans text-xs md:text-sm">
          Manage your personal information and account settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-4xl">
        <div className="flex flex-col gap-6 w-full max-w-xl">
          <Input label="Full Name" type="text" defaultValue="Angela R" required />
          <Input label="Email Address" type="email" defaultValue="angelaruby1@gmail.com" required />
          <Input label="Phone Number" type="tel" defaultValue="9187690560" required />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-fit bg-black hover:bg-black/90 text-white text-xs font-sans font-semibold uppercase tracking-widest px-8 py-3.5 rounded-md transition-colors disabled:opacity-70 flex justify-center items-center text-center h-12"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>

      <div className="mt-5 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div>
            <h3 className="font-semibold text-black text-lg mb-1 font-sans">Password</h3>
            <p className="text-zinc-500 text-sm font-sans">It's a good idea to use a strong password.</p>
          </div>
          <button type="button" onClick={() => setIsPasswordModalOpen(true)} className="flex items-center justify-center gap-2 w-full md:w-auto px-5 py-3 md:py-2.5 border border-black rounded-md text-sm font-sans font-medium text-black hover:bg-zinc-50 transition-colors whitespace-nowrap text-center">
            <FiLock size={16} /> Update Password
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 md:p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-black">Update Password</h2>
                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="text-zinc-400 hover:text-black transition-colors">
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-6">
                <Input label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

                <button
                  type="submit"
                  className="w-full bg-black hover:bg-black/90 text-white text-xs font-sans font-semibold uppercase tracking-widest px-8 py-4 rounded-md transition-colors mt-2"
                >
                  Update Password
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

