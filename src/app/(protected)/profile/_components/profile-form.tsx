import { useTranslations } from "next-intl";
import type { PropsWithChildren } from "react";
import { FormProvider, type UseFormProps, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
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
  const t = useTranslations("Auth");
  const form = useForm<ProfileValues>(formOptions);

  async function handleSubmit(values: ProfileValues) {
    const savedValues = await onSubmit(values);
    if (savedValues) form.reset(savedValues);
  }

  return (
    <FormProvider {...form}>
      <form
        className={cn("flex flex-col gap-5", className)}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FieldGroup className="gap-5">{children}</FieldGroup>
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting || form.formState.disabled}
        >
          {form.formState.isSubmitting ? (
            <>
              <Spinner data-icon="inline-start" />
              {t("savingProfile")}
            </>
          ) : (
            t("saveProfile")
          )}
        </Button>
      </form>
    </FormProvider>
  );
}

export { ProfileForm };
