"use client";

import type { ComponentProps } from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useProfileController } from "../_hooks/use-profile-controller";
import { ProfileAvatarField } from "./profile-avatar-field";
import { ProfileButton } from "./profile-button";
import { ProfileDisplayNameField } from "./profile-display-name-field";
import { ProfileEmailField } from "./profile-email-field";
import { ProfileForm } from "./profile-form";
import { ProfileFormContent } from "./profile-form-content";
import { ProfileFormFooter } from "./profile-form-footer";
import { ProfileLocaleField } from "./profile-locale-field";
import { ProfileThemeField } from "./profile-theme-field";
import { SignOutButton } from "./sign-out-button";

type ProfileCardProps = ComponentProps<"div">;

function ProfileCard({ className, ...props }: ProfileCardProps) {
  const profile = useProfileController();
  const { user, t } = profile;

  if (!profile.authReady || (user && !profile.preferencesReady)) {
    return (
      <div className={cn("mx-auto w-full max-w-sm", className)} {...props}>
        <p role="status" className="text-center text-sm text-muted-foreground">
          {t("loading")}
        </p>
      </div>
    );
  }

  if (!user && !profile.error) return null;

  if (!user || !profile.formProps) {
    return (
      <div className={cn("mx-auto w-full max-w-sm", className)} {...props}>
        <p role="alert">{profile.error ?? t("profileSaveError")}</p>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto w-full max-w-sm", className)} {...props}>
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
    </div>
  );
}

export { ProfileCard };
