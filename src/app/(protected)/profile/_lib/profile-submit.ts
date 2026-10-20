import {
  type User,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorage, getFirebaseUI } from "@/lib/firebase";
import type { ProfileValues } from "./types";
import { writeUserPreferences } from "./user-preferences";

type SaveProfileArgs = {
  user: User;
  previous: ProfileValues;
  values: ProfileValues;
  avatarFile: File | null;
};

export type SavedProfile = {
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

export async function saveProfile({
  user,
  previous,
  values,
  avatarFile,
}: SaveProfileArgs): Promise<SavedProfile> {
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
