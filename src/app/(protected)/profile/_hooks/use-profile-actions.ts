import {
  signOut,
  type User,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { usePathname, useRouter } from "@/i18n/navigation";
import { getFirebaseStorage, getFirebaseUI } from "@/lib/firebase/client";
import { writeUserPreferences } from "@/lib/firebase/firestore/user-preferences";
import type { Locale } from "@/lib/locale";
import type { ThemePreference } from "@/lib/theme";

export type ProfileValues = {
  displayName: string;
  email: string;
  locale: Locale;
  theme: ThemePreference;
};

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
      displayName: displayName || null,
      photoURL,
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

type UseProfileActionsOptions = {
  activeLocale: string;
  avatarFile: File | null;
  savedValuesRef: { current: ProfileValues | null };
  setAvatarFile: (file: File | null) => void;
  setAvatarVersion: (version: number) => void;
  setPhotoURL: (photoURL: string | null) => void;
  setTheme: (theme: ProfileValues["theme"]) => void;
  user: User | null;
};

export function useProfileActions({
  activeLocale,
  avatarFile,
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
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (values: ProfileValues): Promise<ProfileValues | undefined> => {
    const previous = savedValuesRef.current;
    if (!user || !previous) return;

    setIsSaving(true);
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
      return savedProfile.values;
    } catch (cause) {
      console.error(cause);
      toast.add({
        title: t("profileSaveError"),
        type: "error",
      });
      return undefined;
    } finally {
      setIsSaving(false);
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

  return { handleSignOut, isSaving, isSigningOut, onSubmit };
}
