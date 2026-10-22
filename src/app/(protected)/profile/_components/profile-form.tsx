import type { ComponentProps } from "react";
import { FormProvider } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useProfileForm } from "../_hooks/use-profile-form";

type ProfileFormProps = Omit<ComponentProps<"form">, "onSubmit">;

function ProfileForm({ children, className, ...props }: ProfileFormProps) {
  const { form, handleSubmit } = useProfileForm();

  return (
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
  );
}

type ProfileFormContentProps = ComponentProps<typeof FieldGroup>;

function ProfileFormContent({ className, ...props }: ProfileFormContentProps) {
  return <FieldGroup className={cn("gap-4", className)} {...props} />;
}

type ProfileFormFooterProps = ComponentProps<"div">;

function ProfileFormFooter({ className, ...props }: ProfileFormFooterProps) {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)} {...props} />
  );
}

export { ProfileForm, ProfileFormContent, ProfileFormFooter };
