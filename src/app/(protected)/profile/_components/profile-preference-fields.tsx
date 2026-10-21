import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isLocale, locales } from "@/i18n/routing";
import { isThemePreference, themePreferences } from "@/lib/theme";
import { cn } from "@/lib/utils";
import type { ProfileValues } from "../_hooks/use-profile-actions";

type ProfilePreferenceFieldsProps = ComponentProps<"div"> & {
  isBusy?: boolean;
};

function ProfilePreferenceFields({
  className,
  isBusy = false,
  ...props
}: ProfilePreferenceFieldsProps) {
  const t = useTranslations("Auth");
  const { control } = useFormContext<ProfileValues>();

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
                <SelectGroup>
                  {locales.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`languageOptions.${option}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
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
                <SelectGroup>
                  {themePreferences.map((option) => (
                    <SelectItem key={option} value={option}>
                      {t(`themeOptions.${option}`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
    </div>
  );
}

export { ProfilePreferenceFields };
