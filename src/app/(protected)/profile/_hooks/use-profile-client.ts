import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { defaultLocale, isLocale } from "@/i18n/routing";
import { type ProfileValues, useProfileActions } from "./use-profile-actions";
import { useProfileAvatar } from "./use-profile-avatar";
import { useProfileSession } from "./use-profile-session";

export function useProfileClient() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const activeLocale = isLocale(locale) ? locale : defaultLocale;
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

  const session = useProfileSession(reset);
  const avatar = useProfileAvatar();
  const actions = useProfileActions({
    activeLocale: session.activeLocale,
    avatarFile: avatar.avatarFile,
    reset,
    savedValuesRef: session.savedValuesRef,
    setAvatarFile: avatar.setAvatarFile,
    setAvatarVersion: avatar.setAvatarVersion,
    setPhotoURL: session.setPhotoURL,
    setTheme: session.setTheme,
    user: session.user,
  });

  return {
    authReady: session.authReady,
    avatarPreview: avatar.avatarPreview,
    avatarVersion: avatar.avatarVersion,
    control,
    error: session.error,
    errors,
    fileInputRef: avatar.fileInputRef,
    handleAvatarChange: avatar.handleAvatarChange,
    handleSignOut: actions.handleSignOut,
    handleSubmit,
    isBusy: isSubmitting || actions.isSigningOut,
    isSigningOut: actions.isSigningOut,
    isSubmitting,
    photoURL: session.photoURL,
    preferencesReady: session.preferencesReady,
    register,
    savedValuesReady: session.savedValuesRef.current !== null,
    t,
    user: session.user,
    onSubmit: actions.onSubmit,
  };
}

export type ProfileClientState = ReturnType<typeof useProfileClient>;
