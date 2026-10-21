import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ProfileValues } from "../_hooks/use-profile-actions";

type ProfileDisplayNameFieldProps = ComponentProps<typeof Field>;

function ProfileDisplayNameField(props: ProfileDisplayNameFieldProps) {
  const t = useTranslations("Auth");
  const { control } = useFormContext<ProfileValues>();

  return (
    <Controller
      name="displayName"
      control={control}
      render={({ field, fieldState }) => (
        <Field {...props} data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="profile-name">{t("displayNameLabel")}</FieldLabel>
          <Input
            {...field}
            id="profile-name"
            autoComplete="name"
            placeholder={t("notSet")}
            maxLength={100}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export { ProfileDisplayNameField };
