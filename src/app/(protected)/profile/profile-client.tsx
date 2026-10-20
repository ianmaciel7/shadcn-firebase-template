"use client";

import {
  onAuthStateChanged,
  signOut,
  type User,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ArrowLeft, LogOut } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { type ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { defaultLocale, isLocale, type Locale, locales } from "@/i18n/routing";
import { getFirebaseStorage, getFirebaseUI } from "@/lib/firebase";
import {
  isThemePreference,
  readUserPreferences,
  type ThemePreference,
  themePreferences,
  writeUserPreferences,
} from "./_lib/user-preferences";

type ProfileValues = {
  displayName: string;
  email: string;
  locale: Locale;
  theme: ThemePreference;
};

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export default function ProfileClient() {
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
  const [message, setMessage] = useState<string | null>(null);
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

    if (
      !ACCEPTED_AVATAR_TYPES.has(file.type) ||
      file.size > MAX_AVATAR_SIZE
    ) {
      setError(t("profilePhotoInvalid"));
      return;
    }

    setAvatarFile(file);
    setMessage(null);
    setError(null);
  };

  const onSubmit: SubmitHandler<ProfileValues> = async (values) => {
    const previous = savedValuesRef.current;
    if (!user || !previous) return;

    setMessage(null);
    setError(null);

    const displayName = values.displayName.trim();
    const email = values.email.trim();

    try {
      const authUser = getFirebaseUI().get().auth.currentUser;
      if (!authUser || authUser.uid !== user.uid) {
        throw new Error("Authentication session unavailable");
      }

      const emailChanged = email !== (authUser.email ?? "");
      const nameChanged = displayName !== (authUser.displayName ?? "");
      const preferencesChanged =
        values.locale !== previous.locale || values.theme !== previous.theme;

      if (emailChanged) {
        await verifyBeforeUpdateEmail(authUser, email);
      }

      let nextPhotoURL = authUser.photoURL;
      if (avatarFile) {
        const avatarRef = ref(
          getFirebaseStorage(),
          `users/${authUser.uid}/avatar`,
        );
        await uploadBytes(avatarRef, avatarFile, {
          contentType: avatarFile.type,
        });
        nextPhotoURL = await getDownloadURL(avatarRef);
      }

      if (nameChanged || avatarFile) {
        await updateProfile(authUser, {
          displayName: displayName || null,
          photoURL: nextPhotoURL,
        });
        setPhotoURL(nextPhotoURL);
        if (avatarFile) setAvatarVersion(Date.now());
      }

      if (preferencesChanged) {
        await writeUserPreferences(authUser.uid, {
          locale: values.locale,
          theme: values.theme,
        });
      }

      if (values.theme !== previous.theme) setTheme(values.theme);

      const savedValues: ProfileValues = {
        displayName,
        email: authUser.email ?? previous.email,
        locale: values.locale,
        theme: values.theme,
      };
      savedValuesRef.current = savedValues;
      reset(savedValues);
      setAvatarFile(null);
      setMessage(emailChanged ? t("emailVerificationSent") : t("profileSaved"));

      if (values.locale !== activeLocale) {
        router.replace(pathname, { locale: values.locale });
      }
    } catch (cause) {
      console.error(cause);
      setError(t("profileSaveError"));
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setError(null);
    try {
      await signOut(getFirebaseUI().get().auth);
      router.replace("/sign-in");
    } catch (cause) {
      console.error(cause);
      setError(t("profileSaveError"));
      setIsSigningOut(false);
    }
  };

  if (!authReady || (user && !preferencesReady)) {
    return (
      <p role="status" className="text-center text-sm text-muted-foreground">
        {t("loading")}
      </p>
    );
  }

  if (!user) {
    return error ? <p role="alert">{error}</p> : null;
  }

  if (!savedValuesRef.current) {
    return <p role="alert">{error ?? t("profileSaveError")}</p>;
  }

  const fallbackInitial = (
    user.displayName?.charAt(0) ||
    user.email?.charAt(0) ||
    "U"
  ).toUpperCase();

  const avatarSrc = avatarPreview ??
    (photoURL
      ? avatarVersion
        ? `${photoURL}${photoURL.includes("?") ? "&" : "?"}v=${avatarVersion}`
        : photoURL
      : undefined);

  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t("backToHome")}
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{t("personalInfoTitle")}</CardTitle>
          <CardDescription>{t("personalInfoDescription")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FieldGroup className="gap-5">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  {avatarSrc ? (
                    <AvatarImage
                      src={avatarSrc}
                      alt={user.displayName ?? t("profileTitle")}
                    />
                  ) : null}
                  <AvatarFallback className="text-xl">
                    {fallbackInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col items-start">
                  <span className="max-w-full truncate text-sm font-medium">
                    {user.displayName || t("profileTitle")}
                  </span>
                  <span className="max-w-full truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto px-0"
                    disabled={isBusy}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {t("profilePhotoChange")}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    aria-label={t("profilePhotoChange")}
                    disabled={isBusy}
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              <Field>
                <FieldLabel htmlFor="profile-name">
                  {t("displayNameLabel")}
                </FieldLabel>
                <Input
                  id="profile-name"
                  autoComplete="name"
                  placeholder={t("notSet")}
                  maxLength={100}
                  disabled={isBusy}
                  {...register("displayName")}
                />
              </Field>

              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor="profile-email">
                  {t("emailLabel")}
                </FieldLabel>
                <Input
                  id="profile-email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  disabled={isBusy}
                  aria-invalid={Boolean(errors.email)}
                  {...register("email", { required: true })}
                />
                {errors.email ? (
                  <FieldError>{t("profileSaveError")}</FieldError>
                ) : null}
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Controller
                  name="locale"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="profile-language">
                        {t("languageLabel")}
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        disabled={isBusy}
                        onValueChange={(value) => {
                          if (isLocale(value)) field.onChange(value);
                        }}
                      >
                        <SelectTrigger id="profile-language" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locales.map((option) => (
                            <SelectItem key={option} value={option}>
                              {t(`languageOptions.${option}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                <Controller
                  name="theme"
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="profile-theme">
                        {t("themeLabel")}
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        disabled={isBusy}
                        onValueChange={(value) => {
                          if (isThemePreference(value)) field.onChange(value);
                        }}
                      >
                        <SelectTrigger id="profile-theme" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {themePreferences.map((option) => (
                            <SelectItem key={option} value={option}>
                              {t(`themeOptions.${option}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>

            <Button type="submit" className="w-full" disabled={isBusy}>
              {isSubmitting ? t("savingProfile") : t("saveProfile")}
            </Button>

            {message ? (
              <p role="status" className="text-center text-xs text-muted-foreground">
                {message}
              </p>
            ) : null}
            {error ? (
              <FieldError className="text-center">{error}</FieldError>
            ) : null}
          </form>

          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              disabled={isBusy}
              onClick={handleSignOut}
            >
              <LogOut className="size-4" aria-hidden="true" />
              {t("signOut")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
