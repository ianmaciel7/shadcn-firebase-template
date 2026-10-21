import type { ComponentProps } from "react";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { ProfileControllerState } from "../_hooks/use-profile-controller";
import { ProfileAvatarField } from "./profile-avatar-field";
import { ProfilePreferenceFields } from "./profile-preference-fields";
import { ProfileTextFields } from "./profile-text-fields";

type ProfileFormProps = ComponentProps<"form"> & {
  profile: ProfileControllerState;
  user: NonNullable<ProfileControllerState["user"]>;
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
        className={cn("flex flex-col gap-5", className)}
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
              <Spinner data-icon="inline-start" />
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
