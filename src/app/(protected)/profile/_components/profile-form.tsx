import type { ComponentProps, PropsWithChildren } from "react";
import { FormProvider, type UseFormProps, useForm } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { ProfileValues } from "../_hooks/use-profile-actions";

type ProfileFormProps = PropsWithChildren<
  UseFormProps<ProfileValues> & {
    className?: string;
    onSubmit: (values: ProfileValues) => Promise<ProfileValues | undefined>;
  }
>;

function ProfileForm({
  children,
  className,
  onSubmit,
  ...formOptions
}: ProfileFormProps) {
  const form = useForm<ProfileValues>(formOptions);

  async function handleSubmit(values: ProfileValues) {
    const savedValues = await onSubmit(values);
    if (savedValues) form.reset(savedValues);
  }

  return (
    <FormProvider {...form}>
      <form
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
  return <FieldGroup {...props} className={cn("gap-4", className)} />;
}

type ProfileFormFooterProps = ComponentProps<"div">;

function ProfileFormFooter({ className, ...props }: ProfileFormFooterProps) {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)} {...props} />
  );
}

export { ProfileForm, ProfileFormContent, ProfileFormFooter };
