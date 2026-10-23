import type { User } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { subscribeToSession } from "@/lib/auth/session";

type AuthState =
  | { status: "loading"; user: null; error: null }
  | { status: "ready"; user: User | null; error: null }
  | { status: "error"; user: null; error: string };

export function useProfileAuth() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState>({
    status: "loading",
    user: null,
    error: null,
  });
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    function onError(cause: Error) {
      console.error(cause);
      setAuth({ status: "error", user: null, error: t("profileLoadError") });
    }

    try {
      return subscribeToSession(
        (user) => {
          setAuth({ status: "ready", user, error: null });
          setPhotoURL(user?.photoURL ?? null);
          if (!user) router.replace("/sign-in");
        },
        onError,
      );
    } catch (cause) {
      onError(cause instanceof Error ? cause : new Error(String(cause)));
    }
  }, [router, t]);

  return {
    authReady: auth.status !== "loading",
    error: auth.error,
    photoURL,
    setPhotoURL,
    user: auth.user,
  };
}
