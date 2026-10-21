"use client";

import { Loading } from "@/components/ui/extensions/loading";
import { useProfileSection } from "../_hooks/use-profile-section";
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
  const { profile, state, t } = useProfileSection();

  if (state.status === "loading") {
    return (
      <ProfileCard>
        <ProfileCardContent>
          <Loading className="w-full text-sm text-muted-foreground">
            {t("loading")}
          </Loading>
        </ProfileCardContent>
      </ProfileCard>
    );
  }

  if (state.status === "hidden") return null;

  if (state.status === "error") {
    return (
      <ProfileCard>
        <ProfileCardContent>
          <p role="alert">{state.message}</p>
        </ProfileCardContent>
      </ProfileCard>
    );
  }

  return (
    <ProfileSessionContext value={profile}>
      <ProfileCard>
        <ProfileForm key={state.userId}>
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
