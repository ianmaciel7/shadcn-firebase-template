import { onAuthStateChanged } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getFirebaseUI } from "@/lib/firebase/client";

export function useAuthNav() {
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

  return { href, label };
}
