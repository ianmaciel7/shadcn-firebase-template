"use client";

import type { ComponentProps } from "react";
import { FormProvider } from "react-hook-form";
import { FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useProfileFormClient } from "../_hooks/use-profile-form";

type ProfileFormClientProps = Omit<ComponentProps<"form">, "onSubmit">;

function ProfileFormClient({
  children,
  className,
  ...props
}: ProfileFormClientProps) {
  const { form, handleSubmit } = useProfileFormClient();

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

type ProfileFormClientContentProps = ComponentProps<typeof FieldGroup>;

function ProfileFormClientContent({
  className,
  ...props
}: ProfileFormClientContentProps) {
  return <FieldGroup className={cn("gap-4", className)} {...props} />;
}

type ProfileFormClientFooterProps = ComponentProps<"div">;

function ProfileFormClientFooter({
  className,
  ...props
}: ProfileFormClientFooterProps) {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)} {...props} />
  );
}

export { ProfileFormClient, ProfileFormClientContent, ProfileFormClientFooter };
