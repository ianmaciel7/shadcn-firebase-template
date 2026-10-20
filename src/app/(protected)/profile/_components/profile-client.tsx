"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProfileClient } from "../_hooks/use-profile-client";
import ProfileForm from "./profile-form";
import { SignOutButton } from "./sign-out-button";

export default function ProfileClient() {
  const profile = useProfileClient();
  const { authReady, error, preferencesReady, savedValuesReady, t, user } =
    profile;

  if (!authReady || (user && !preferencesReady)) {
    return (
      <p role="status" className="text-center text-sm text-muted-foreground">
        {t("loading")}
      </p>
    );
  }

  if (!user) return error ? <p role="alert">{error}</p> : null;
  if (!savedValuesReady)
    return <p role="alert">{error ?? t("profileSaveError")}</p>;

  return (
    <div className="mx-auto w-full max-w-sm">
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
