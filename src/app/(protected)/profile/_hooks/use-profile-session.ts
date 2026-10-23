import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { defaultLocale, isLocale } from "@/i18n/routing";
import { getFirebaseUI } from "@/lib/firebase/client";
import { readUserPreferences } from "@/lib/firebase/firestore/user-preferences";
import type { ProfileValues } from "@/lib/profile";
import { useProfileAuth } from "./use-profile-auth";

type PreferencesState =
  | { uid: string; status: "ready"; values: ProfileValues }
  | { uid: string; status: "error"; message: string };

export function useProfileSession() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const activeLocale = isLocale(locale) ? locale : defaultLocale;
  const { setTheme } = useTheme();
  const auth = useProfileAuth();
  const savedValuesRef = useRef<ProfileValues | null>(null);

  const [preferences, setPreferences] = useState<PreferencesState | null>(null);
  const [avatarVersion, setAvatarVersion] = useState(0);
  const uid = auth.user?.uid;
  const current = preferences?.uid === uid ? preferences : null;
  const defaultValues = current?.status === "ready" ? current.values : null;
  const preferencesReady = Boolean(uid && current);

  useEffect(() => {
    if (!uid) return;
    let active = true;
    savedValuesRef.current = null;
    setPreferences(null);

    void readUserPreferences(uid)
      .then((preferences) => {
        if (!active) return;
        const currentUser = getFirebaseUI().get().auth.currentUser;
        if (!currentUser || currentUser.uid !== uid) return;

        const values: ProfileValues = {
          displayName: currentUser.displayName ?? "",
          email: currentUser.email ?? "",
          locale: preferences.locale ?? activeLocale,
          theme: preferences.theme ?? "system",
        };

        savedValuesRef.current = values;
        setPreferences({ uid, status: "ready", values });
        if (preferences.theme) setTheme(preferences.theme);
      })
      .catch((cause) => {
        console.error(cause);
        if (active)
          setPreferences({ uid, status: "error", message: t("profileLoadError") });
      });

    return () => {
      active = false;
    };
  }, [uid, activeLocale, setTheme, t]);

  return {
    activeLocale,
    authReady: auth.authReady,
    avatarVersion,
    defaultValues,
    error: (current?.status === "error" ? current.message : null) ?? auth.error,
    photoURL: auth.photoURL,
    preferencesReady,
    savedValuesRef,
    setAvatarVersion,
    setPhotoURL: auth.setPhotoURL,
    setTheme,
    user: auth.user,
  };
}
