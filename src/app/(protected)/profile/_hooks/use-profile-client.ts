import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "@/components/ui/toast";
import { usePathname, useRouter } from "@/i18n/navigation";
import { defaultLocale, isLocale } from "@/i18n/routing";
import { getFirebaseUI } from "@/lib/firebase";
import { saveProfile } from "../_lib/profile-submit";
import type { ProfileValues } from "../_lib/types";
import { readUserPreferences } from "../_lib/user-preferences";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function useProfileClient() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const activeLocale = isLocale(locale) ? locale : defaultLocale;
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedValuesRef = useRef<ProfileValues | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ProfileValues>({
    defaultValues: {
      displayName: "",
      email: "",
      locale: activeLocale,
      theme: "system",
    },
  });

  const isBusy = isSubmitting || isSigningOut;

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

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_AVATAR_TYPES.has(file.type) || file.size > MAX_AVATAR_SIZE) {
      toast.add({
        title: t("profilePhotoInvalid"),
        type: "error",
      });
      return;
    }

    setAvatarFile(file);
  };

  const onSubmit: SubmitHandler<ProfileValues> = async (values) => {
    const previous = savedValuesRef.current;
    if (!user || !previous) return;

    try {
      const savedProfile = await saveProfile({
        user,
        previous,
        values,
        avatarFile,
      });
      setPhotoURL(savedProfile.photoURL);
      if (savedProfile.avatarChanged) setAvatarVersion(Date.now());
      if (values.theme !== previous.theme) setTheme(values.theme);
      savedValuesRef.current = savedProfile.values;
      reset(savedProfile.values);
      setAvatarFile(null);

      toast.add({
        title: savedProfile.emailChanged
          ? t("emailVerificationSent")
          : t("profileSaved"),
        type: "success",
      });

      if (values.locale !== activeLocale) {
        router.replace(pathname, { locale: values.locale });
      }
    } catch (cause) {
      console.error(cause);
      toast.add({
        title: t("profileSaveError"),
        type: "error",
      });
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut(getFirebaseUI().get().auth);
      router.replace("/sign-in");
    } catch (cause) {
      console.error(cause);
      toast.add({
        title: t("profileSaveError"),
        type: "error",
      });
      setIsSigningOut(false);
    }
  };

  return {
    authReady,
    avatarPreview,
    avatarVersion,
    control,
    error,
    errors,
    fileInputRef,
    handleAvatarChange,
    handleSignOut,
    handleSubmit,
    isBusy,
    isSigningOut,
    isSubmitting,
    photoURL,
    preferencesReady,
    register,
    savedValuesReady: savedValuesRef.current !== null,
    t,
    user,
    onSubmit,
  };
}
