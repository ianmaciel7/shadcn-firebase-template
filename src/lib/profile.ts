import {
  type User,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getActiveUser } from "@/lib/auth/session";
import { getFirebaseStorage } from "@/lib/firebase/client";
import { writeUserPreferences } from "@/lib/firebase/firestore/user-preferences";
import type { Locale } from "@/lib/locale";
import type { ThemePreference } from "@/lib/theme";

export type ProfileValues = {
  displayName: string;
  email: string;
  locale: Locale;
  theme: ThemePreference;
};

export type ProfileFormValues = ProfileValues & { avatarFile: File | null };

export type SavedProfile = {
  values: ProfileValues;
  photoURL: string | null;
  avatarChanged: boolean;
  emailChanged: boolean;
};

/** Ports for profile persistence. Tests may inject adapters without Firebase. */
export type ProfileDependencies = {
  getActiveUser: typeof getActiveUser;
  verifyBeforeUpdateEmail: typeof verifyBeforeUpdateEmail;
  updateProfile: typeof updateProfile;
  uploadAvatar: (user: User, avatarFile: File | null) => Promise<string | null>;
  writeUserPreferences: typeof writeUserPreferences;
};

async function uploadAvatar(user: User, avatarFile: File | null) {
  if (!avatarFile) return user.photoURL;

  const avatarRef = ref(getFirebaseStorage(), `users/${user.uid}/avatar`);
  await uploadBytes(avatarRef, avatarFile, { contentType: avatarFile.type });
  return getDownloadURL(avatarRef);
}

const defaultProfileDependencies: ProfileDependencies = {
  getActiveUser,
  verifyBeforeUpdateEmail,
  updateProfile,
  uploadAvatar,
  writeUserPreferences,
};

export async function saveProfile(
  {
    user,
    previous,
    values,
    avatarFile,
  }: {
    user: User;
    previous: ProfileValues;
    values: ProfileValues;
    avatarFile: File | null;
  },
  dependencies: ProfileDependencies = defaultProfileDependencies,
): Promise<SavedProfile> {
  const authUser = dependencies.getActiveUser(user);
  const displayName = values.displayName.trim();
  const email = values.email.trim();
  const emailChanged = email !== (authUser.email ?? "");
  const nameChanged = displayName !== (authUser.displayName ?? "");
  const preferencesChanged =
    values.locale !== previous.locale || values.theme !== previous.theme;

  if (emailChanged) await dependencies.verifyBeforeUpdateEmail(authUser, email);

  // Recheck after every asynchronous boundary before starting another write.
  dependencies.getActiveUser(user);
  const photoURL = await dependencies.uploadAvatar(authUser, avatarFile);
  const avatarChanged = Boolean(avatarFile);
  if (nameChanged || avatarChanged) {
    dependencies.getActiveUser(user);
    await dependencies.updateProfile(authUser, {
      ...(nameChanged ? { displayName: displayName || null } : {}),
      ...(avatarChanged ? { photoURL } : {}),
    });
  }
  if (preferencesChanged) {
    dependencies.getActiveUser(user);
    await dependencies.writeUserPreferences(authUser.uid, {
      locale: values.locale,
      theme: values.theme,
    });
  }

  dependencies.getActiveUser(user);
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
