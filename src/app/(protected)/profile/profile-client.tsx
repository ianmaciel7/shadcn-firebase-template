"use client";

import {
  onAuthStateChanged,
  signOut,
  type User,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { defaultLocale, isLocale, type Locale, locales } from "@/i18n/routing";
import { getFirebaseStorage, getFirebaseUI } from "@/lib/firebase";
import {
  isThemePreference,
  readUserPreferences,
  type ThemePreference,
  themePreferences,
  writeUserPreferences,
} from "./_lib/user-preferences";

export default function ProfilePage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const locale = useLocale();
  const activeLocale = isLocale(locale) ? locale : defaultLocale;
  const { setTheme, theme } = useTheme();
  const [user, setUser] = useState<User | null>(() => {
    try {
      return getFirebaseUI().get().auth.currentUser;
    } catch {
      return null;
    }
  });
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedLocale, setSelectedLocale] = useState<Locale>(activeLocale);
  const [selectedTheme, setSelectedTheme] = useState<ThemePreference>("system");
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const auth = getFirebaseUI().get().auth;
      return onAuthStateChanged(auth, setUser);
    } catch (cause) {
      console.error(cause);
    }
  }, []);

  useEffect(() => {
    setDisplayName(user?.displayName ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  useEffect(() => setIsMounted(true), []);
  useEffect(() => setSelectedLocale(activeLocale), [activeLocale]);

  useEffect(() => {
    if (!user) return;

    let active = true;
    void readUserPreferences(user.uid)
      .then((preferences) => {
        if (!active) return;
        if (preferences.locale) setSelectedLocale(preferences.locale);
        if (preferences.theme) {
          setSelectedTheme(preferences.theme);
          setTheme(preferences.theme);
        }
      })
      .catch((cause) => console.error(cause));

    return () => {
      active = false;
    };
  }, [setTheme, user]);

  const handleSignOut = async () => {
    try {
      await signOut(getFirebaseUI().get().auth);
    } catch (cause) {
      console.error(cause);
    } finally {
      router.replace("/sign-in");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !email.trim()) return;

    setIsSaving(true);
    setMessage(null);
    setError(null);
    try {
      const authUser = getFirebaseUI().get().auth.currentUser ?? user;
      const nameChanged = displayName.trim() !== (user.displayName ?? "");
      const emailChanged = email.trim() !== (user.email ?? "");

      if (nameChanged) {
        await updateProfile(authUser, {
          displayName: displayName.trim() || null,
        });
      }
      if (emailChanged) {
        await verifyBeforeUpdateEmail(authUser, email.trim());
      }

      setMessage(emailChanged ? t("emailVerificationSent") : t("profileSaved"));
    } catch (cause) {
      console.error(cause);
      setError(t("profileSaveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!user || !file) return;

    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      setAvatarMessage(t("profilePhotoInvalid"));
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarMessage(null);
    try {
      const avatarRef = ref(getFirebaseStorage(), `users/${user.uid}/avatar`);
      await uploadBytes(avatarRef, file, { contentType: file.type });
      const photoURL = await getDownloadURL(avatarRef);
      const authUser = getFirebaseUI().get().auth.currentUser ?? user;
      await updateProfile(authUser, { photoURL });
      await authUser.reload();
      setUser(authUser);
      setAvatarMessage(t("profilePhotoSaved"));
    } catch (cause) {
      console.error(cause);
      setAvatarMessage(t("profilePhotoError"));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const savePreference = async (
    preference: Partial<{ locale: Locale; theme: ThemePreference }>,
  ) => {
    if (!user) return;
    try {
      await writeUserPreferences(user.uid, preference);
    } catch (cause) {
      console.error(cause);
    }
  };

  const handleLocaleChange = (value: string | null) => {
    if (!isLocale(value)) return;
    setSelectedLocale(value);
    // biome-ignore lint/suspicious/noDocumentCookie: next-intl resolves the locale from this cookie on the next request.
    document.cookie = `NEXT_LOCALE=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
    void savePreference({ locale: value });
    router.refresh();
  };

  const handleThemeChange = (value: string | null) => {
    if (!isThemePreference(value)) return;
    setSelectedTheme(value);
    setTheme(value);
    void savePreference({ theme: value });
  };

  if (!user) return null;

  const fallbackInitial = (
    user.displayName?.charAt(0) ||
    user.email?.charAt(0) ||
    t("profileTitle").charAt(0)
  ).toUpperCase();

  return (
    <div className="mx-auto w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>{t("personalInfoTitle")}</CardTitle>
          <CardDescription>{t("personalInfoDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-16">
                {user.photoURL ? (
                  <AvatarImage
                    src={user.photoURL}
                    alt={user.displayName ?? t("profileTitle")}
                  />
                ) : null}
                <AvatarFallback className="text-xl">
                  {fallbackInitial}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium leading-none">
                  {user.displayName || t("profileTitle")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
                <label
                  htmlFor="profile-photo"
                  className="w-fit cursor-pointer text-xs font-medium text-primary hover:underline"
                >
                  {isUploadingAvatar
                    ? t("profilePhotoUploading")
                    : t("profilePhotoChange")}
                </label>
                <input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleAvatarChange}
                  disabled={isUploadingAvatar}
                />
                {avatarMessage ? (
                  <p
                    className="text-xs text-muted-foreground"
                    aria-live="polite"
                  >
                    {avatarMessage}
                  </p>
                ) : null}
              </div>
            </div>

            <Field>
              <FieldLabel htmlFor="profile-name">
                {t("displayNameLabel")}
              </FieldLabel>
              <Input
                id="profile-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder={t("notSet")}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="profile-email">{t("emailLabel")}</FieldLabel>
              <Input
                id="profile-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="profile-uid">{t("uidLabel")}</FieldLabel>
              <Input
                id="profile-uid"
                value={user.uid}
                disabled
                className="bg-muted font-mono text-xs"
              />
            </Field>

            <FieldSeparator>{t("preferencesTitle")}</FieldSeparator>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="profile-language">
                  {t("languageLabel")}
                </FieldLabel>
                <Select
                  value={selectedLocale}
                  onValueChange={handleLocaleChange}
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

              <Field>
                <FieldLabel htmlFor="profile-theme">
                  {t("themeLabel")}
                </FieldLabel>
                <Select
                  value={isMounted ? (theme ?? selectedTheme) : "system"}
                  onValueChange={handleThemeChange}
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
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? t("savingProfile") : t("saveProfile")}
            </Button>

            {message ? (
              <p
                className="text-center text-xs text-muted-foreground"
                aria-live="polite"
              >
                {message}
              </p>
            ) : null}
            {error ? (
              <FieldError className="text-center">{error}</FieldError>
            ) : null}
          </form>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <Link
              href="/"
              className={buttonVariants({
                variant: "link",
                size: "sm",
                className:
                  "px-0 text-xs text-muted-foreground hover:text-foreground",
              })}
            >
              {t("backToHome")}
            </Link>
            <Button
              type="button"
              variant="link"
              size="sm"
              className="px-0 text-xs text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              {t("signOut")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
