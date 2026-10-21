import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ProfileValues } from "../_hooks/use-profile-actions";

type ProfileTextFieldsProps = ComponentProps<typeof FieldGroup> & {
  isBusy?: boolean;
};

function ProfileTextFields({
  className,
  isBusy = false,
  ...props
}: ProfileTextFieldsProps) {
  const t = useTranslations("Auth");
  const {
    register,
    formState: { errors },
  } = useFormContext<ProfileValues>();

  return (
    <FieldGroup className={cn("gap-4", className)} {...props}>
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
    </FieldGroup>
  );
}

export { ProfileTextFields };
