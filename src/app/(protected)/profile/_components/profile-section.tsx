"use client";

import { useTranslations } from "next-intl";
import { useProfileSession } from "../_hooks/use-profile-session";
import { ProfileSessionContext } from "../_hooks/use-profile-session-context";
import { ProfileAvatarField } from "./profile-avatar-field";
import {
  ProfileCard,
  ProfileCardContent,
  ProfileCardDescription,
  ProfileCardFooter,
  ProfileCardHeader,
  ProfileCardTitle,
} from "./profile-card";
import { ProfileDisplayNameField } from "./profile-display-name-field";
import { ProfileEmailField } from "./profile-email-field";
import {
  ProfileForm,
  ProfileFormContent,
  ProfileFormFooter,
} from "./profile-form";
import { ProfileLocaleField } from "./profile-locale-field";
import { ProfileSaveButton } from "./profile-save-button";
import { ProfileSignOutButton } from "./profile-sign-out-button";
import { ProfileThemeField } from "./profile-theme-field";

function ProfileSection() {
  const profile = useProfileSession();
  const { user } = profile;
  const t = useTranslations("Auth");

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

  if (!user || !profile.defaultValues) {
    return (
      <ProfileCard>
        <ProfileCardContent>
          <p role="alert">{profile.error ?? t("profileSaveError")}</p>
        </ProfileCardContent>
      </ProfileCard>
    );
  }

  return (
    <ProfileSessionContext value={profile}>
      <ProfileCard>
        <ProfileForm key={user.uid}>
          <ProfileCardHeader>
            <ProfileCardTitle>{t("personalInfoTitle")}</ProfileCardTitle>
            <ProfileCardDescription>
              {t("personalInfoDescription")}
            </ProfileCardDescription>
          </ProfileCardHeader>
          <ProfileCardContent>
            <ProfileFormContent>
              <ProfileAvatarField />
              <ProfileDisplayNameField />
              <ProfileEmailField />
              <ProfileLocaleField />
              <ProfileThemeField />
            </ProfileFormContent>
          </ProfileCardContent>
          <ProfileCardFooter>
            <ProfileFormFooter>
              <ProfileSaveButton />
              <ProfileSignOutButton />
            </ProfileFormFooter>
          </ProfileCardFooter>
        </ProfileForm>
      </ProfileCard>
    </ProfileSessionContext>
  );
}

export { ProfileSection };
