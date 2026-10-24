"use client";

import { usePathname } from "next/navigation";
import { isLocale } from "@/lib/locale";

/** App code uses public URLs even if Next exposes the internal rewrite path. */
export function usePublicPathname() {
  const pathname = usePathname();
  const firstSegment = pathname.split("/")[1];
  return isLocale(firstSegment)
    ? pathname.slice(firstSegment.length + 1) || "/"
    : pathname;
}
