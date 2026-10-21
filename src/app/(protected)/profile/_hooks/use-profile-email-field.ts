import { useTranslations } from "next-intl";
import { useId } from "react";
import { useFormContext } from "react-hook-form";
import type { ProfileValues } from "@/lib/profile";

export function useProfileEmailField() {
  const id = useId();
  const t = useTranslations("Auth");
  const { control } = useFormContext<ProfileValues>();
  return { id, t, control };
}
