import { onAuthStateChanged, type User } from "firebase/auth";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import type { UseFormReset } from "react-hook-form";
import { useRouter } from "@/i18n/navigation";
import { defaultLocale, isLocale } from "@/i18n/routing";
import { getFirebaseUI } from "@/lib/firebase/client";
import { readUserPreferences } from "@/lib/firebase/firestore/user-preferences";
import type { ProfileValues } from "./use-profile-actions";

export function useProfileSession(reset: UseFormReset<ProfileValues>) {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const activeLocale = isLocale(locale) ? locale : defaultLocale;
  const router = useRouter();
  const { setTheme } = useTheme();
  const savedValuesRef = useRef<ProfileValues | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
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

  const uid = user?.uid;

  useEffect(() => {
    if (!uid) return;
    let active = true;
    setPreferencesReady(false);

    void readUserPreferences(uid)
      .then((preferences) => {
        if (!active) return;
        const currentUser = getFirebaseUI().get().auth.currentUser;
        if (!currentUser || currentUser.uid !== uid) return;

        const nextValues: ProfileValues = {
          displayName: currentUser.displayName ?? "",
          email: currentUser.email ?? "",
          locale: preferences.locale ?? activeLocale,
          theme: preferences.theme ?? "system",
        };

        savedValuesRef.current = nextValues;
        reset(nextValues);
        if (preferences.theme) setTheme(preferences.theme);
      })
      .catch((cause) => {
        console.error(cause);
        if (active) setError(t("profileSaveError"));
      })
      .finally(() => {
        if (active) setPreferencesReady(true);
      });

    return () => {
      active = false;
    };
  }, [uid, activeLocale, reset, setTheme, t]);

  return {
    activeLocale,
    authReady,
    error,
    preferencesReady,
    savedValuesRef,
    setPhotoURL,
    setTheme,
    user,
    photoURL,
  };
}
