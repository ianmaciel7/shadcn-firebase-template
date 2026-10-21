import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { ProfileValues } from "../_hooks/use-profile-actions";

type ProfileButtonProps = ComponentProps<typeof Button>;

function ProfileButton({
  className,
  disabled,
  ...props
}: ProfileButtonProps) {
  const t = useTranslations("Auth");
  const { formState } = useFormContext<ProfileValues>();
  const isSubmitting = formState.isSubmitting;

  return (
    <Button
      {...props}
      type="submit"
      className={cn("w-full", className)}
      disabled={disabled || isSubmitting || formState.disabled}
    >
      {isSubmitting ? (
        <>
          <Spinner data-icon="inline-start" />
          {t("savingProfile")}
        </>
      ) : (
        t("saveProfile")
      )}
    </Button>
  );
}

export { ProfileButton };
