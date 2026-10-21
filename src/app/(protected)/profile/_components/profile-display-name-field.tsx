import type { ComponentProps } from "react";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useProfileDisplayNameField } from "../_hooks/use-profile-display-name-field";

type ProfileDisplayNameFieldProps = ComponentProps<typeof Field>;

function ProfileDisplayNameField(props: ProfileDisplayNameFieldProps) {
  const { id, t, control } = useProfileDisplayNameField();

  return (
    <Controller
      name="displayName"
      control={control}
      render={({ field, fieldState }) => (
        <Field {...props} data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{t("displayNameLabel")}</FieldLabel>
          <Input
            {...field}
            id={id}
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
