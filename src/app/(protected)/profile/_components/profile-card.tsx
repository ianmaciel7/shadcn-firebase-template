"use client";

import type { ComponentProps } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useProfileController } from "../_hooks/use-profile-controller";
import { ProfileAvatarField } from "./profile-avatar-field";
import { ProfileDisplayNameField } from "./profile-display-name-field";
import { ProfileEmailField } from "./profile-email-field";
import { ProfileForm } from "./profile-form";
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

  if (!user) {
    return profile.error ? (
      <div className={cn("mx-auto w-full max-w-sm", className)} {...props}>
        <p role="alert">{profile.error}</p>
      </div>
    ) : null;
  }

  if (!profile.formProps) {
    return (
      <div className={cn("mx-auto w-full max-w-sm", className)} {...props}>
        <p role="alert">{profile.error ?? t("profileSaveError")}</p>
      </div>
    );
  }

  return (
    <div className={cn("mx-auto w-full max-w-sm", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{t("personalInfoTitle")}</CardTitle>
          <CardDescription>{t("personalInfoDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm key={user.uid} {...profile.formProps}>
            <ProfileAvatarField {...profile.avatarProps} />
            <ProfileDisplayNameField />
            <ProfileEmailField />
            <ProfileLocaleField />
            <ProfileThemeField />
          </ProfileForm>
        </CardContent>
        <CardFooter>
          <SignOutButton
            onClick={profile.handleSignOut}
            disabled={profile.isBusy}
            isSigningOut={profile.isSigningOut}
          >
            {t("signOut")}
          </SignOutButton>
        </CardFooter>
      </Card>
    </div>
  );
}

export { ProfileCard };
