import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { ProfileFormValues } from "@/lib/profile";
import { cn } from "@/lib/utils";

type ProfileSaveButtonProps = Omit<
  ComponentProps<typeof Button>,
  "type" | "onClick"
>;

function ProfileSaveButton({
  className,
  disabled,
  children,
  ...props
}: ProfileSaveButtonProps) {
  const t = useTranslations("Auth");
  const { formState } = useFormContext<ProfileFormValues>();
  const isSubmitting = formState.isSubmitting;

  return (
    <Button
      {...props}
      type="submit"
      aria-busy={isSubmitting}
      className={cn("w-full", className)}
      disabled={disabled || isSubmitting || formState.disabled}
    >
      {isSubmitting ? (
        <>
          <Spinner data-icon="inline-start" />
          {children ?? t("savingProfile")}
        </>
      ) : (
        (children ?? t("saveProfile"))
      )}
    </Button>
  );
}

export { ProfileSaveButton };
