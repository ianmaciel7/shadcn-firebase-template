"use client";

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileController } from "../_hooks/use-profile-controller";
import { ProfileAvatarField } from "./profile-avatar-field";
import { ProfileButton } from "./profile-button";
import { ProfileCard } from "./profile-card";
import { ProfileDisplayNameField } from "./profile-display-name-field";
import { ProfileEmailField } from "./profile-email-field";
import { ProfileForm } from "./profile-form";
import { ProfileFormContent } from "./profile-form-content";
import { ProfileFormFooter } from "./profile-form-footer";
import { ProfileLocaleField } from "./profile-locale-field";
import { ProfileThemeField } from "./profile-theme-field";
import { SignOutButton } from "./sign-out-button";

function ProfileSection() {
  const profile = useProfileController();
  const { user, t } = profile;

  if (!profile.authReady || (user && !profile.preferencesReady)) {
    return (
      <ProfileCard>
        <CardContent>
          <p
            role="status"
            className="text-center text-sm text-muted-foreground"
          >
            {t("loading")}
          </p>
        </CardContent>
      </ProfileCard>
    );
  }

  if (!user && !profile.error) return null;

  if (!user || !profile.formProps) {
    return (
      <ProfileCard>
        <CardContent>
          <p role="alert">{profile.error ?? t("profileSaveError")}</p>
        </CardContent>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard>
      <ProfileForm key={user.uid} {...profile.formProps}>
        <CardHeader>
          <CardTitle>{t("personalInfoTitle")}</CardTitle>
          <CardDescription>{t("personalInfoDescription")}</CardDescription>
        </CardHeader>
        <ProfileFormContent>
          <ProfileAvatarField {...profile.avatarProps} />
          <ProfileDisplayNameField />
          <ProfileEmailField />
          <ProfileLocaleField />
          <ProfileThemeField />
        </ProfileFormContent>
        <ProfileFormFooter>
          <ProfileButton />
          <SignOutButton
            onClick={profile.handleSignOut}
            disabled={profile.isBusy}
            isSigningOut={profile.isSigningOut}
          >
            {t("signOut")}
          </SignOutButton>
        </ProfileFormFooter>
      </ProfileForm>
    </ProfileCard>
  );
}

export { ProfileSection };
