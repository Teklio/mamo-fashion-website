"use client"
import { useState } from "react";
import Input from "@/components/Input";
import { toast } from "sonner";

export default function AccountDetailsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic password validation (optional)
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Information Updated", {
        description: "Your account details have been successfully saved.",
      });
    }, 1000);
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
            <Input label="Full Name" type="text" defaultValue="Angela R" required />
            <Input label="Email Address" type="email" defaultValue="angelaruby1@gmail.com" required />
            <Input label="Phone Number" type="tel" defaultValue="9187690560" required />
          </div>
          {/* Right Column */}
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
            <Input label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
            <Input label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            <Input label="Confirm New Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-fit bg-black hover:bg-black/90 text-white text-xs font-sans px-8 py-3.5 rounded-md transition-colors disabled:opacity-70 flex justify-center items-center h-12"
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            "Edit Information"
          )}
        </button>
      </form>
    </div>
  );
}

