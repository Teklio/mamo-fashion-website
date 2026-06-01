import Header from "@/components/Header";
import AccountSidebar from "@/app/account/_components/AccountSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SORIN | Your Account",
  description: "Manage your personal information, orders and account settings.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen bg-[#fafafa] overflow-x-hidden pt-20">
      <Header theme="light" />
      <div className="relative z-10 max-w-400 mx-auto px-8 md:px-16 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start mt-0 md:mt-10">
          <AccountSidebar />
          <div className="w-full flex-1">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
