"use client";

import type { ComponentProps } from "react";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useProfileEmailField } from "../_hooks/use-profile-email-field";

type ProfileEmailFieldProps = ComponentProps<typeof Field>;

function ProfileEmailField(props: ProfileEmailFieldProps) {
  const { id, t, control } = useProfileEmailField();

  return (
    <Controller
      name="email"
      control={control}
      rules={{ required: t("profileSaveError") }}
      render={({ field, fieldState }) => (
        <Field {...props} data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{t("emailLabel")}</FieldLabel>
          <Input
            {...field}
            id={id}
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
