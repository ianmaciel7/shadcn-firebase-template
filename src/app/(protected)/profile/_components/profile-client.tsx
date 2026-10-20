"use client";

import { LogOut } from "lucide-react";
import { Controller } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { isLocale, locales } from "@/i18n/routing";
import {
  isThemePreference,
  themePreferences,
} from "@/lib/firebase/firestore/user-preferences";
import { useProfileClient } from "../_hooks/use-profile-client";

type ProfileState = ReturnType<typeof useProfileClient>;
type AuthenticatedUser = NonNullable<ProfileState["user"]>;

export default function ProfileClient() {
  const {
    authReady,
    avatarPreview,
    avatarVersion,
    control,
    error,
    errors,
    fileInputRef,
    handleAvatarChange,
    handleSignOut,
    handleSubmit,
    isBusy,
    isSigningOut,
    isSubmitting,
    photoURL,
    preferencesReady,
    register,
    savedValuesReady,
    t,
    user,
    onSubmit,
  } = useProfileClient();

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

  if (!savedValuesReady) {
    return <p role="alert">{error ?? t("profileSaveError")}</p>;
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>{t("personalInfoTitle")}</CardTitle>
          <CardDescription>{t("personalInfoDescription")}</CardDescription>
        </CardHeader>

        <CardContent>
          <ProfileForm
            avatarPreview={avatarPreview}
            avatarVersion={avatarVersion}
            control={control}
            errors={errors}
            fileInputRef={fileInputRef}
            handleAvatarChange={handleAvatarChange}
            handleSubmit={handleSubmit}
            isBusy={isBusy}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            photoURL={photoURL}
            register={register}
            t={t}
            user={user}
          />
          <SignOutButton
            handleSignOut={handleSignOut}
            isBusy={isBusy}
            isSigningOut={isSigningOut}
            t={t}
          />
        </CardContent>
      </Card>
    </div>
  );
}

type ProfileFormProps = Pick<
  ProfileState,
  | "avatarPreview"
  | "avatarVersion"
  | "control"
  | "errors"
  | "fileInputRef"
  | "handleAvatarChange"
  | "handleSubmit"
  | "isBusy"
  | "isSubmitting"
  | "onSubmit"
  | "photoURL"
  | "register"
  | "t"
> & { user: AuthenticatedUser };

function ProfileForm({
  handleSubmit,
  isBusy,
  isSubmitting,
  onSubmit,
  t,
  ...identityAndFields
}: ProfileFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FieldGroup className="gap-5">
        <ProfileIdentity isBusy={isBusy} t={t} {...identityAndFields} />
        <ProfileTextFields isBusy={isBusy} t={t} {...identityAndFields} />
        <ProfilePreferenceFields isBusy={isBusy} t={t} {...identityAndFields} />
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={isBusy}>
        {isSubmitting ? (
          <>
            <Spinner />
            {t("savingProfile")}
          </>
        ) : (
          t("saveProfile")
        )}
      </Button>
    </form>
  );
}

type ProfileIdentityProps = Pick<
  ProfileState,
  | "avatarPreview"
  | "avatarVersion"
  | "fileInputRef"
  | "handleAvatarChange"
  | "photoURL"
  | "t"
> & { isBusy: boolean; user: AuthenticatedUser };

function ProfileIdentity({
  avatarPreview,
  avatarVersion,
  fileInputRef,
  handleAvatarChange,
  isBusy,
  photoURL,
  t,
  user,
}: ProfileIdentityProps) {
  const avatarSrc = getAvatarSource(avatarPreview, photoURL, avatarVersion);
  const fallbackInitial = getFallbackInitial(user);

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-16">
        {avatarSrc ? (
          <AvatarImage
            src={avatarSrc}
            alt={user.displayName ?? t("profileTitle")}
          />
        ) : null}
        <AvatarFallback className="text-xl">{fallbackInitial}</AvatarFallback>
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
  );
}

type ProfileTextFieldsProps = Pick<
  ProfileState,
  "errors" | "register" | "t"
> & {
  isBusy: boolean;
};

function ProfileTextFields({
  errors,
  isBusy,
  register,
  t,
}: ProfileTextFieldsProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="profile-name">{t("displayNameLabel")}</FieldLabel>
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
        <FieldLabel htmlFor="profile-email">{t("emailLabel")}</FieldLabel>
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
        {errors.email ? <FieldError>{t("profileSaveError")}</FieldError> : null}
      </Field>
    </>
  );
}

type ProfilePreferenceFieldsProps = Pick<ProfileState, "control" | "t"> & {
  isBusy: boolean;
};

function ProfilePreferenceFields({
  control,
  isBusy,
  t,
}: ProfilePreferenceFieldsProps) {
  return (
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
            <FieldLabel htmlFor="profile-theme">{t("themeLabel")}</FieldLabel>
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
  );
}

type SignOutButtonProps = Pick<
  ProfileState,
  "handleSignOut" | "isSigningOut" | "t"
> & { isBusy: boolean };

function SignOutButton({
  handleSignOut,
  isBusy,
  isSigningOut,
  t,
}: SignOutButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="mt-2 w-full text-muted-foreground hover:text-destructive"
      disabled={isBusy}
      onClick={handleSignOut}
    >
      {isSigningOut ? (
        <Spinner />
      ) : (
        <LogOut className="size-4" aria-hidden="true" />
      )}
      {t("signOut")}
    </Button>
  );
}

function getAvatarSource(
  preview: ProfileState["avatarPreview"],
  photoURL: ProfileState["photoURL"],
  version: ProfileState["avatarVersion"],
) {
  if (preview) return preview;
  if (!photoURL || !version) return photoURL ?? undefined;

  const separator = photoURL.includes("?") ? "&" : "?";
  return `${photoURL}${separator}v=${version}`;
}

function getFallbackInitial(user: AuthenticatedUser) {
  return (
    user.displayName?.charAt(0) ||
    user.email?.charAt(0) ||
    "U"
  ).toUpperCase();
}
