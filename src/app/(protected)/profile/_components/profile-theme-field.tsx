"use client";

import type { ComponentProps } from "react";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isThemePreference, themePreferences } from "@/lib/theme";
import { useProfileThemeField } from "../_hooks/use-profile-theme-field";

type ProfileThemeFieldProps = ComponentProps<typeof Field>;

function ProfileThemeField(props: ProfileThemeFieldProps) {
  const { id, t, control } = useProfileThemeField();

  return (
    <Controller
      name="theme"
      control={control}
      render={({ field, fieldState }) => (
        <Field {...props} data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{t("themeLabel")}</FieldLabel>
          <Select
            name={field.name}
            value={field.value}
            disabled={field.disabled}
            onValueChange={(value) => {
              if (isThemePreference(value)) field.onChange(value);
            }}
          >
            <SelectTrigger
              id={id}
              className="w-full"
              aria-invalid={fieldState.invalid}
              onBlur={field.onBlur}
            >
              <SelectValue>
                {(value) =>
                  isThemePreference(value)
                    ? t(`themeOptions.${value}`)
                    : undefined
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {themePreferences.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`themeOptions.${option}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export { ProfileThemeField };
