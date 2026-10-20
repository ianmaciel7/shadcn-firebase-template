import type { ComponentProps } from "react";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { ProfileClientState } from "../_hooks/use-profile-client";
import { ProfileAvatarField } from "./profile-avatar-field";
import { ProfilePreferenceFields } from "./profile-preference-fields";
import { ProfileTextFields } from "./profile-text-fields";

export type ProfileFormProps = ComponentProps<"form"> & {
  profile: ProfileClientState;
  user: NonNullable<ProfileClientState["user"]>;
};

function ProfileForm({
  className,
  onSubmit: onSubmitProp,
  profile,
  user,
  ...props
}: ProfileFormProps) {
  const { form, handleSubmit, isBusy, isSubmitting, onSubmit, t } = profile;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmitProp ?? handleSubmit(onSubmit)}
        className={cn("space-y-5", className)}
        {...props}
      >
        <FieldGroup className="gap-5">
          <ProfileAvatarField profile={profile} user={user} />
          <ProfileTextFields isBusy={isBusy} />
          <ProfilePreferenceFields isBusy={isBusy} />
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
    </FormProvider>
  );
}

export { ProfileForm };
