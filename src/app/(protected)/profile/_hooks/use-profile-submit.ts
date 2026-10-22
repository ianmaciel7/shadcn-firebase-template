import type { User } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { localeCookie } from "@/i18n/routing";
import {
  type ProfileFormValues,
  type ProfileValues,
  type SavedProfile,
  saveProfile,
} from "@/lib/profile";
import { toast } from "@/lib/toast";
import { withUsageGuard } from "@/lib/usage/guard";

type UseProfileSubmitOptions = {
  activeLocale: string;
  savedValuesRef: { current: ProfileValues | null };
  setAvatarVersion: (version: number) => void;
  setPhotoURL: (photoURL: string | null) => void;
  setTheme: (theme: ProfileValues["theme"]) => void;
  user: User | null;
};

export function useProfileSubmit({
  activeLocale,
  savedValuesRef,
  setAvatarVersion,
  setPhotoURL,
  setTheme,
  user,
}: UseProfileSubmitOptions) {
  const t = useTranslations("Auth");
  const router = useRouter();

  const onSubmit = async (
    values: ProfileFormValues,
  ): Promise<ProfileValues | undefined> => {
    const previous = savedValuesRef.current;
    if (!user || !previous) return;

    try {
      const savedProfile: SavedProfile = await withUsageGuard(
        { type: "function_use", name: "profile.update" },
        () =>
          saveProfile({
            user,
            previous,
            values,
            avatarFile: values.avatarFile,
          }),
      );
      setPhotoURL(savedProfile.photoURL);
      if (savedProfile.avatarChanged) setAvatarVersion(Date.now());
      if (values.theme !== previous.theme) setTheme(values.theme);
      savedValuesRef.current = savedProfile.values;

      toast.add({
        title: savedProfile.emailChanged
          ? t("emailVerificationSent")
          : t("profileSaved"),
        type: "success",
      });

      if (values.locale !== activeLocale) {
        // biome-ignore lint/suspicious/noDocumentCookie: Support browsers without the Cookie Store API; the server reads this non-secret locale cookie.
        document.cookie = `${localeCookie}=${values.locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
        router.refresh();
      }
      return savedProfile.values;
    } catch (cause) {
      console.error(cause);
      toast.add({
        title: t("profileSaveError"),
        type: "error",
      });
      return undefined;
    }
  };

  return { onSubmit };
}
