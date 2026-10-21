"use client";

import { useProfileController } from "../_hooks/use-profile-controller";
import { ProfileAvatarField } from "./profile-avatar-field";
import { ProfileButton } from "./profile-button";
import {
  ProfileCard,
  ProfileCardContent,
  ProfileCardDescription,
  ProfileCardHeader,
  ProfileCardTitle,
} from "./profile-card";
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
        <ProfileCardContent>
          <p
            role="status"
            className="text-center text-sm text-muted-foreground"
          >
            {t("loading")}
          </p>
        </ProfileCardContent>
      </ProfileCard>
    );
  }

  if (!user && !profile.error) return null;

  if (!user || !profile.formProps) {
    return (
      <ProfileCard>
        <ProfileCardContent>
          <p role="alert">{profile.error ?? t("profileSaveError")}</p>
        </ProfileCardContent>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard>
      <ProfileForm key={user.uid} {...profile.formProps}>
        <ProfileCardHeader>
          <ProfileCardTitle>{t("personalInfoTitle")}</ProfileCardTitle>
          <ProfileCardDescription>
            {t("personalInfoDescription")}
          </ProfileCardDescription>
        </ProfileCardHeader>
        <ProfileCardContent>
          <ProfileFormContent>
            <ProfileAvatarField {...profile.avatarProps} />
            <ProfileDisplayNameField />
            <ProfileEmailField />
            <ProfileLocaleField />
            <ProfileThemeField />
          </ProfileFormContent>
        </ProfileCardContent>
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
