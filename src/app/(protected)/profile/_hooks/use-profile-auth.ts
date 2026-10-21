import { onAuthStateChanged, type User } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { getFirebaseUI } from "@/lib/firebase/client";

export function useProfileAuth() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const auth = getFirebaseUI().get().auth;
      return onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser);
          setPhotoURL(currentUser?.photoURL ?? null);
          setAuthReady(true);
          if (!currentUser) router.replace("/sign-in");
        },
        (cause) => {
          console.error(cause);
          setError(t("profileSaveError"));
          setAuthReady(true);
        },
      );
    } catch (cause) {
      console.error(cause);
      setError(t("profileSaveError"));
      setAuthReady(true);
    }
  }, [router, t]);

  return { authReady, error, photoURL, setPhotoURL, user };
}
