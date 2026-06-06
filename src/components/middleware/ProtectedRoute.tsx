"use client";

import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import type { RootState } from "@/store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useSelector(
    (s: RootState) => s.auth.isAuthenticated,
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, router, pathname]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
