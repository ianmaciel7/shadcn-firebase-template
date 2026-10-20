import { signOut } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "@/components/ui/toast";
import { usePathname, useRouter } from "@/i18n/navigation";
import { getFirebaseUI } from "@/lib/firebase";
import { saveProfile } from "../_lib/profile-submit";
import type { ProfileValues } from "../_lib/types";

type UseProfileActionsOptions = {
  activeLocale: string;
  avatarFile: File | null;
  reset: (values: ProfileValues) => void;
  savedValuesRef: { current: ProfileValues | null };
  setAvatarFile: (file: File | null) => void;
  setAvatarVersion: (version: number) => void;
  setPhotoURL: (photoURL: string | null) => void;
  setTheme: (theme: ProfileValues["theme"]) => void;
  user: Parameters<typeof saveProfile>[0]["user"] | null;
};

export function useProfileActions({
  activeLocale,
  avatarFile,
  reset,
  savedValuesRef,
  setAvatarFile,
  setAvatarVersion,
  setPhotoURL,
  setTheme,
  user,
}: UseProfileActionsOptions) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  return { handleSignOut, isSigningOut, onSubmit };
}
