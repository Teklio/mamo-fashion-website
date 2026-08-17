"use client";

import { usePathname } from "next/navigation";
import HomeLoadingScreen from "@/components/HomeLoadingScreen";

/**
 * NavigationLoader — shows the HomeLoadingScreen on initial load 
 * and on every route change across the entire application.
 */
export default function NavigationLoader() {
  const pathname = usePathname();

  // Using pathname as a key forces the HomeLoadingScreen to completely 
  // remount and play its full 2500ms animation on every route change.
  return <HomeLoadingScreen key={pathname} />;
}
