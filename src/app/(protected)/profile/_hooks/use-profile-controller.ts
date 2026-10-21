import { useTranslations } from "next-intl";
import { useProfileActions } from "./use-profile-actions";
import { useProfileAvatar } from "./use-profile-avatar";
import { useProfileSession } from "./use-profile-session";

export function useProfileController() {
  const t = useTranslations("Auth");
  const session = useProfileSession();
  const avatar = useProfileAvatar();
  const actions = useProfileActions({
    activeLocale: session.activeLocale,
    avatarFile: avatar.avatarFile,
    savedValuesRef: session.savedValuesRef,
    setAvatarFile: avatar.setAvatarFile,
    setAvatarVersion: session.setAvatarVersion,
    setPhotoURL: session.setPhotoURL,
    setTheme: session.setTheme,
    user: session.user,
  });
  const isBusy = actions.isSaving || actions.isSigningOut;

  return {
    authReady: session.authReady,
    error: session.error,
    preferencesReady: session.preferencesReady,
    user: session.user,
    t,
    isBusy,
    formProps: session.defaultValues
      ? {
          defaultValues: session.defaultValues,
          disabled: isBusy,
          onSubmit: actions.onSubmit,
        }
      : null,
    avatarProps: {
      displayName: session.user?.displayName ?? null,
      email: session.user?.email ?? null,
      photoURL: session.photoURL,
      avatarPreview: avatar.avatarPreview,
      avatarVersion: session.avatarVersion,
      fileInputRef: avatar.fileInputRef,
      onFileChange: avatar.handleAvatarChange,
      disabled: isBusy,
    },
    handleSignOut: actions.handleSignOut,
    isSigningOut: actions.isSigningOut,
  };
}
