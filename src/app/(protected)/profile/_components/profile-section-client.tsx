"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/extensions/loading";
import { FieldGroup } from "@/components/ui/field";
import { useProfileSection } from "../_hooks/use-profile-section";
import { ProfileSessionContext } from "../_hooks/use-profile-session-context";
import { ProfileAvatarField } from "./profile-avatar-field-client";
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
} from "./profile-form-client";
import { ProfileLocaleField } from "./profile-locale-field";
import { ProfileSaveButton } from "./profile-save-button";
import { ProfileThemeField } from "./profile-theme-field";

function ProfileSection() {
  const { profile, state, t } = useProfileSection();

  if (state.isLoading) {
    return (
      <Loading className="w-full text-sm text-muted-foreground">
        {t("loading")}
      </Loading>
    );
  }

  if (state.isHidden) return null;

  if (state.isError) {
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
              <FieldGroup>
                <ProfileDisplayNameField />
                <ProfileEmailField />
                <ProfileLocaleField />
                <ProfileThemeField />
              </FieldGroup>
            </ProfileFormContent>
          </ProfileCardContent>
          <ProfileCardFooter>
            <ProfileFormFooter>
              <ProfileSaveButton />
              <Button
                variant="link"
                size="sm"
                nativeButton={false}
                role="link"
                render={<Link href="/" />}
                className="w-full text-xs"
              >
                {t("backToHome")}
              </Button>
            </ProfileFormFooter>
          </ProfileCardFooter>
        </ProfileForm>
      </ProfileCard>
    </ProfileSessionContext>
  );
}

export { ProfileSection };
