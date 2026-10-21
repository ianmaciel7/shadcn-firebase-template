"use client";

import type { ComponentProps } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useProfileClient } from "../_hooks/use-profile-client";
import { ProfileForm } from "./profile-form";
import { SignOutButton } from "./sign-out-button";

type ProfileClientProps = ComponentProps<"div">;

function ProfileClient({ className, ...props }: ProfileClientProps) {
  const profile = useProfileClient();
  const { authReady, error, preferencesReady, savedValuesReady, t, user } =
    profile;

  if (!authReady || (user && !preferencesReady)) {
    return (
      <div className={cn("mx-auto w-full max-w-sm", className)} {...props}>
        <p role="status" className="text-center text-sm text-muted-foreground">
          {t("loading")}
        </p>
      </div>
    );
  }

  if (!user) {
    return error ? (
      <div className={cn("mx-auto w-full max-w-sm", className)} {...props}>
        <p role="alert">{error}</p>
      </div>
    ) : null;
  }

  if (!savedValuesReady) {
    return (
      <div className={cn("mx-auto w-full max-w-sm", className)} {...props}>
        <p role="alert">{error ?? t("profileSaveError")}</p>
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
          <ProfileForm profile={profile} user={user} />
          <SignOutButton profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}

export { ProfileClient };
