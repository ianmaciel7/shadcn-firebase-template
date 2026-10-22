import {
  type User,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/toast";
import { useRouter } from "@/i18n/navigation";
import { localeCookie } from "@/i18n/routing";
import { getFirebaseStorage, getFirebaseUI } from "@/lib/firebase/client";
import { writeUserPreferences } from "@/lib/firebase/firestore/user-preferences";
import type { ProfileFormValues, ProfileValues } from "@/lib/profile";
import { withUsageGuard } from "@/lib/usage/guard";

type SavedProfile = {
  values: ProfileValues;
  photoURL: string | null;
  avatarChanged: boolean;
  emailChanged: boolean;
};

function getCurrentUser(expectedUser: User) {
  const currentUser = getFirebaseUI().get().auth.currentUser;
  if (!currentUser || currentUser.uid !== expectedUser.uid) {
    throw new Error("Authentication session unavailable");
  }
  return currentUser;
}

async function uploadAvatar(user: User, avatarFile: File | null) {
  if (!avatarFile) return user.photoURL;

  const avatarRef = ref(getFirebaseStorage(), `users/${user.uid}/avatar`);
  await uploadBytes(avatarRef, avatarFile, { contentType: avatarFile.type });
  return getDownloadURL(avatarRef);
}

async function saveProfile({
  user,
  previous,
  values,
  avatarFile,
}: {
  user: User;
  previous: ProfileValues;
  values: ProfileValues;
  avatarFile: File | null;
}): Promise<SavedProfile> {
  const authUser = getCurrentUser(user);
  const displayName = values.displayName.trim();
  const email = values.email.trim();
  const emailChanged = email !== (authUser.email ?? "");
  const nameChanged = displayName !== (authUser.displayName ?? "");
  const preferencesChanged =
    values.locale !== previous.locale || values.theme !== previous.theme;

  if (emailChanged) await verifyBeforeUpdateEmail(authUser, email);

  const photoURL = await uploadAvatar(authUser, avatarFile);
  const avatarChanged = Boolean(avatarFile);
  if (nameChanged || avatarChanged) {
    await updateProfile(authUser, {
      ...(nameChanged ? { displayName: displayName || null } : {}),
      ...(avatarChanged ? { photoURL } : {}),
    });
  }
  if (preferencesChanged) {
    await writeUserPreferences(authUser.uid, {
      locale: values.locale,
      theme: values.theme,
    });
  }

  return {
    photoURL,
    avatarChanged,
    emailChanged,
    values: {
      displayName,
      email: authUser.email ?? previous.email,
      locale: values.locale,
      theme: values.theme,
    },
  };
}

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
      const savedProfile = await withUsageGuard(
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
