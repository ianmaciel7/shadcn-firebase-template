"use client";

import { signOut } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { getFirebaseUI } from "@/lib/firebase/client";

export function useHomeSignOutButton() {
  const t = useTranslations("Home");
  const auth = useTranslations("Auth");
  const [state, setState] = useState<"idle" | "pending" | "error">("idle");

  async function handleSignOut() {
    if (state === "pending") return;
    setState("pending");
    try {
      await signOut(getFirebaseUI().get().auth);
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
