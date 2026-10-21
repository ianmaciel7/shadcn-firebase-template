"use client";

import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { getFirebaseUI } from "@/lib/firebase/client";

function AuthNavButton() {
  const t = useTranslations("App");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const auth = getFirebaseUI().get().auth;
      return onAuthStateChanged(auth, (user) => {
        setIsLoggedIn(!!user);
      });
    } catch {
      // If Firebase is not configured or fails to initialize, remain in signed-out state
    }
  }, []);

  const href = isLoggedIn ? "/profile" : "/sign-in";
  const label = isLoggedIn ? t("openApp") : t("signIn");

  return (
    <Link
      href={href}
      aria-label={label}
      className={buttonVariants({
        variant: "outline",
        className:
          "flex h-12 w-full items-center justify-center rounded-full px-5 text-base font-medium md:w-[158px]",
      })}
    >
      {label}
    </Link>
  );
}

export { AuthNavButton };
