import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ProfileValues } from "../_hooks/use-profile-actions";

type ProfileEmailFieldProps = ComponentProps<typeof Field>;

function ProfileEmailField(props: ProfileEmailFieldProps) {
  const t = useTranslations("Auth");
  const { control } = useFormContext<ProfileValues>();

  return (
    <Controller
      name="email"
      control={control}
      rules={{ required: t("profileSaveError") }}
      render={({ field, fieldState }) => (
        <Field {...props} data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="profile-email">{t("emailLabel")}</FieldLabel>
          <Input
            {...field}
            id="profile-email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export { ProfileEmailField };
