"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { signOutUser } from "@/lib/auth/auth";

export function useHomeSignOutButton() {
  const t = useTranslations("Home");
  const auth = useTranslations("Auth");
  const [state, setState] = useState<"idle" | "pending" | "error">("idle");

  async function handleSignOut() {
    if (state === "pending") return;
    setState("pending");
    try {
      await signOutUser();
    } catch {
      setState("error");
    }
  }

  const isPending = state === "pending";
  const isError = state === "error";

  return {
    t,
    auth,
    state,
    isPending,
    isError,
    handleSignOut,
  };
}
