import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ProfileFormValues } from "@/lib/profile";
import { useProfileSessionContext } from "./use-profile-session-context";
import { useProfileSubmit } from "./use-profile-submit";

export function useProfileForm() {
  const session = useProfileSessionContext();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { onSubmit } = useProfileSubmit(session);
  const form = useForm<ProfileFormValues>({
    defaultValues: { ...session.defaultValues, avatarFile: null },
    values: { ...session.defaultValues, avatarFile: null },
    resetOptions: { keepDirtyValues: true },
    disabled: isSigningOut || isSaving,
  });

  async function handleSubmit(values: ProfileFormValues) {
    if (isSigningOut || isSaving) return;
    setIsSaving(true);
    try {
      const savedValues = await onSubmit(values);
      if (savedValues) {
        form.reset(
          { ...savedValues, avatarFile: null },
          { keepDirtyValues: false },
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  return { form, handleSubmit, isSigningOut, setIsSigningOut };
}
