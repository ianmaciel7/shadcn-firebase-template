"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/extensions/loading-indicator";
import { useProfileSectionClient } from "../_hooks/use-profile-section-client";
import { ProfileSessionContext } from "../_hooks/use-profile-session-context";
import { ProfileAvatarFieldClient } from "./profile-avatar-field-client";
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
  ProfileFormClient,
  ProfileFormClientContent,
  ProfileFormClientFooter,
} from "./profile-form-client";
import { ProfileLocaleField } from "./profile-locale-field";
import { ProfileSaveButton } from "./profile-save-button";
import { ProfileThemeField } from "./profile-theme-field";

type ProfileSectionClientProps = ComponentProps<"div">;

function ProfileSectionClient(props: ProfileSectionClientProps) {
  const { profile, state, t } = useProfileSectionClient();

  if (state.status === "loading") {
    return (
      <div {...props}>
        <LoadingIndicator className="w-full text-sm text-muted-foreground">
          {t("loading")}
        </LoadingIndicator>
      </div>
    );
  }

  if (state.status === "hidden") return null;

  if (state.status === "error") {
    return (
      <ProfileCard {...props}>
        <ProfileCardContent>
          <p role="alert">{state.message}</p>
        </ProfileCardContent>
      </ProfileCard>
    );
  }

  return (
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
            <ProfileFormClientContent>
              <ProfileAvatarFieldClient />
              <ProfileDisplayNameField />
              <ProfileEmailField />
              <ProfileLocaleField />
              <ProfileThemeField />
            </ProfileFormClientContent>
          </ProfileCardContent>
          <ProfileCardFooter>
            <ProfileFormClientFooter>
              <ProfileSaveButton />
              <Link
                href="/"
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "w-full text-xs",
                })}
              >
                {t("backToHome")}
              </Link>
            </ProfileFormClientFooter>
          </ProfileCardFooter>
        </ProfileFormClient>
      </ProfileCard>
    </ProfileSessionContext>
  );
}

export { ProfileSectionClient };
