import { type ComponentProps, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import type { ProfileFormValues } from "@/lib/profile";
import { cn } from "@/lib/utils";
import { ProfileFormStateContext } from "../_hooks/use-profile-form-state";
import { useProfileSessionContext } from "../_hooks/use-profile-session-context";
import { useProfileSubmit } from "../_hooks/use-profile-submit";

type ProfileFormProps = Omit<ComponentProps<"form">, "onSubmit">;

function ProfileForm({ children, className, ...props }: ProfileFormProps) {
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

  return (
    <ProfileFormStateContext value={{ isSigningOut, setIsSigningOut }}>
      <FormProvider {...form}>
        <form
          {...props}
          data-slot="profile-form"
          className={cn("flex w-full flex-col gap-(--card-spacing)", className)}
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          {children}
        </form>
      </FormProvider>
    </ProfileFormStateContext>
  );
}

type ProfileFormContentProps = ComponentProps<typeof FieldGroup>;

function ProfileFormContent(props: ProfileFormContentProps) {
  return <FieldGroup {...props} />;
}

type ProfileFormFooterProps = ComponentProps<"div">;

function ProfileFormFooter({ className, ...props }: ProfileFormFooterProps) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)} {...props} />
  );
}

export { ProfileForm, ProfileFormContent, ProfileFormFooter };
