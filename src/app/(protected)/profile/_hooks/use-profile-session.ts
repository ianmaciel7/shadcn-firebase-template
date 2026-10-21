import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { defaultLocale, isLocale } from "@/i18n/routing";
import { getFirebaseUI } from "@/lib/firebase/client";
import { readUserPreferences } from "@/lib/firebase/firestore/user-preferences";
import type { ProfileValues } from "@/lib/profile";
import { useProfileAuth } from "./use-profile-auth";

export function useProfileSession() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const activeLocale = isLocale(locale) ? locale : defaultLocale;
  const { setTheme } = useTheme();
  const auth = useProfileAuth();
  const savedValuesRef = useRef<ProfileValues | null>(null);

  const [loaded, setLoaded] = useState<{
    uid: string;
    values: ProfileValues;
  } | null>(null);
  const [readyUid, setReadyUid] = useState<string | null>(null);
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const uid = auth.user?.uid;
  const defaultValues = loaded && loaded.uid === uid ? loaded.values : null;
  const preferencesReady = Boolean(uid && readyUid === uid);

  useEffect(() => {
    if (!uid) return;
    let active = true;
    savedValuesRef.current = null;
    setReadyUid(null);

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
        setLoaded({ uid, values: nextValues });
        if (preferences.theme) setTheme(preferences.theme);
      })
      .catch((cause) => {
        console.error(cause);
        if (active) setError(t("profileSaveError"));
      })
      .finally(() => {
        if (active) setReadyUid(uid);
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
    error: error ?? auth.error,
    photoURL: auth.photoURL,
    preferencesReady,
    savedValuesRef,
    setAvatarVersion,
    setPhotoURL: auth.setPhotoURL,
    setTheme,
    user: auth.user,
  };
}
