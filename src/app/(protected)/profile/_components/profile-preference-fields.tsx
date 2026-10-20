import type { ComponentProps } from "react";
import { Controller } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isLocale, locales } from "@/i18n/routing";
import { isThemePreference, themePreferences } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type { ProfileClientState } from "../_hooks/use-profile-client";

export type ProfilePreferenceFieldsProps = ComponentProps<"div"> & {
  profile: ProfileClientState;
};

export function ProfilePreferenceFields({
  className,
  profile,
  ...props
}: ProfilePreferenceFieldsProps) {
  const { control, isBusy, t } = profile;

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)} {...props}>
      <Controller
        name="locale"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="profile-language">
              {t("languageLabel")}
            </FieldLabel>
            <Select
              name={field.name}
              value={field.value}
              disabled={isBusy}
              onValueChange={(value) => {
                if (isLocale(value)) field.onChange(value);
              }}
            >
              <SelectTrigger id="profile-language" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locales.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`languageOptions.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
      />
      <Controller
        name="theme"
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="profile-theme">{t("themeLabel")}</FieldLabel>
            <Select
              name={field.name}
              value={field.value}
              disabled={isBusy}
              onValueChange={(value) => {
                if (isThemePreference(value)) field.onChange(value);
              }}
            >
              <SelectTrigger id="profile-theme" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themePreferences.map((option) => (
                  <SelectItem key={option} value={option}>
                    {t(`themeOptions.${option}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
      />
    </div>
  );
}
