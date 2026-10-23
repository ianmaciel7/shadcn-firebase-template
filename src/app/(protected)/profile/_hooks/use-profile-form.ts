import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ProfileFormValues } from "@/lib/profile";
import { useProfileSessionContext } from "./use-profile-session-context";
import { useProfileSubmit } from "./use-profile-submit";

export function useProfileFormClient() {
  const session = useProfileSessionContext();
  const [isSaving, setIsSaving] = useState(false);
  const { onSubmit } = useProfileSubmit(session);
  const form = useForm<ProfileFormValues>({
    defaultValues: { ...session.defaultValues, avatarFile: null },
    values: { ...session.defaultValues, avatarFile: null },
    resetOptions: { keepDirtyValues: true },
    disabled: isSaving,
  });

  function handleSubmit(values: ProfileFormValues) {
    if (isSaving) return;
    setIsSaving(true);
    return onSubmit(values)
      .then((savedValues) => {
        if (savedValues) {
          form.reset(
            { ...savedValues, avatarFile: null },
            { keepDirtyValues: false },
          );
        }
      })
      .finally(() => setIsSaving(false));
  }

  return { form, handleSubmit };
}
