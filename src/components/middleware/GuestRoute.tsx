"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { RootState } from "@/store";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useSelector(
    (s: RootState) => s.auth.isAuthenticated,
  );
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/account");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return <>{children}</>;
}
