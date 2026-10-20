import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import type { ProfileClientState } from "../_hooks/use-profile-client";
import { ProfileIdentity } from "./profile-identity";
import { ProfilePreferenceFields } from "./profile-preference-fields";
import { ProfileTextFields } from "./profile-text-fields";

type ProfileFormProps = {
  profile: ProfileClientState;
  user: NonNullable<ProfileClientState["user"]>;
};

export default function ProfileForm({ profile, user }: ProfileFormProps) {
  const { handleSubmit, isBusy, isSubmitting, onSubmit, t } = profile;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FieldGroup className="gap-5">
        <ProfileIdentity profile={profile} user={user} />
        <ProfileTextFields profile={profile} />
        <ProfilePreferenceFields profile={profile} />
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={isBusy}>
        {isSubmitting ? (
          <>
            <Spinner />
            {t("savingProfile")}
          </>
        ) : (
          t("saveProfile")
        )}
      </Button>
    </form>
  );
}
