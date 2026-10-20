import type { ComponentProps } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ProfileClientState } from "../_hooks/use-profile-client";

export type ProfileTextFieldsProps = ComponentProps<"div"> & {
  profile: ProfileClientState;
};

export function ProfileTextFields({
  className,
  profile,
  ...props
}: ProfileTextFieldsProps) {
  const { errors, isBusy, register, t } = profile;

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <Field>
        <FieldLabel htmlFor="profile-name">{t("displayNameLabel")}</FieldLabel>
        <Input
          id="profile-name"
          autoComplete="name"
          placeholder={t("notSet")}
          maxLength={100}
          disabled={isBusy}
          {...register("displayName")}
        />
      </Field>
      <Field data-invalid={Boolean(errors.email)}>
        <FieldLabel htmlFor="profile-email">{t("emailLabel")}</FieldLabel>
        <Input
          id="profile-email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          disabled={isBusy}
          aria-invalid={Boolean(errors.email)}
          {...register("email", { required: true })}
        />
        {errors.email ? <FieldError>{t("profileSaveError")}</FieldError> : null}
      </Field>
    </div>
  );
}
