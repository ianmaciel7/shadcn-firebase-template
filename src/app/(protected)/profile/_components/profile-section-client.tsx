"use client";

import type { ComponentProps } from "react";
import { useProfileSectionClient } from "../_hooks/use-profile-section-client";
import { ProfileSessionContext } from "../_lib/session-context";
import { ProfileAvatarFieldClient } from "./profile-avatar-field-client";
import { ProfileBackToHomeButton } from "./profile-back-to-home-button";
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
import { ProfileFallback } from "./profile-fallback";
import { ProfileFormClient } from "./profile-form-client";
import { ProfileLocaleField } from "./profile-locale-field";
import { ProfileSaveButton } from "./profile-save-button";
import { ProfileThemeField } from "./profile-theme-field";

type ProfileSectionClientProps = ComponentProps<"div">;

function ProfileSectionClient(props: ProfileSectionClientProps) {
  const { profile, status, userId, t } = useProfileSectionClient();

  return (
    <ProfileFallback status={status} {...props}>
      <ProfileSessionContext value={profile}>
        <ProfileCard {...props}>
          <ProfileFormClient key={userId}>
            <ProfileCardHeader>
              <ProfileCardTitle>{t("personalInfoTitle")}</ProfileCardTitle>
              <ProfileCardDescription>
                {t("personalInfoDescription")}
              </ProfileCardDescription>
            </ProfileCardHeader>
            <ProfileCardContent>
              <ProfileAvatarFieldClient />
              <ProfileDisplayNameField />
              <ProfileEmailField />
              <ProfileLocaleField />
              <ProfileThemeField />
            </ProfileCardContent>
            <ProfileCardFooter>
              <ProfileSaveButton />
              <ProfileBackToHomeButton />
            </ProfileCardFooter>
          </ProfileFormClient>
        </ProfileCard>
      </ProfileSessionContext>
    </ProfileFallback>
  );
}

export { ProfileSectionClient };
