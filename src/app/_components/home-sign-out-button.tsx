"use client";

import { signOut } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getFirebaseUI } from "@/lib/firebase/client";

function HomeSignOutButton() {
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

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto">
      <Button
        type="button"
        variant="outline"
        onClick={handleSignOut}
        disabled={state === "pending"}
        className="flex h-12 w-full items-center justify-center rounded-full px-5 text-base font-medium md:w-[158px]"
      >
        {state === "pending" ? t("signingOut") : auth("signOut")}
      </Button>
      {state === "error" && (
        <p role="alert" className="max-w-xs text-sm text-destructive">
          {t("signOutError")}
        </p>
      )}
    </div>
  );
}

export { HomeSignOutButton };
