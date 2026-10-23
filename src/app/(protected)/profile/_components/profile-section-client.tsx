"use client";

import type { ComponentProps } from "react";
import { FieldGroup } from "@/components/ui/field";
import { useProfileSectionClient } from "../_hooks/use-profile-section-client";
import { ProfileSessionContext } from "../_hooks/use-profile-session-context";
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
import { ProfileFormClient } from "./profile-form-client";
import { ProfileLocaleField } from "./profile-locale-field";
import { ProfileSaveButton } from "./profile-save-button";
import { ProfileSectionState } from "./profile-section-state";
import { ProfileThemeField } from "./profile-theme-field";

type ProfileSectionClientProps = ComponentProps<"div">;

function ProfileSectionClient(props: ProfileSectionClientProps) {
  const { profile, state, t } = useProfileSectionClient();

  return (
    <ProfileSectionState {...props} state={state}>
      <ProfileSessionContext value={profile}>
        <ProfileCard {...props}>
          <ProfileFormClient key={state.userId}>
            <ProfileCardHeader>
              <ProfileCardTitle>{t("personalInfoTitle")}</ProfileCardTitle>
              <ProfileCardDescription>
                {t("personalInfoDescription")}
              </ProfileCardDescription>
            </ProfileCardHeader>
            <ProfileCardContent>
              <FieldGroup className="gap-4">
                <ProfileAvatarFieldClient />
                <ProfileDisplayNameField />
                <ProfileEmailField />
                <ProfileLocaleField />
                <ProfileThemeField />
              </FieldGroup>
            </ProfileCardContent>
            <ProfileCardFooter>
              <ProfileSaveButton />
              <ProfileBackToHomeButton />
            </ProfileCardFooter>
          </ProfileFormClient>
        </ProfileCard>
      </ProfileSessionContext>
    </ProfileSectionState>
  );
}

export { ProfileSectionClient };
