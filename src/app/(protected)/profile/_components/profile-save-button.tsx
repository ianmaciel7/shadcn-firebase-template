"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/extensions/loading";
import { cn } from "@/lib/utils";
import { useProfileSaveButton } from "../_hooks/use-profile-save-button";

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
  const { t, isSubmitting, isDisabled } = useProfileSaveButton();

  return (
    <Button
      {...props}
      type="submit"
      aria-busy={isSubmitting}
      className={cn("w-full", className)}
      disabled={disabled || isDisabled}
    >
      {isSubmitting ? (
        <Loading>{children ?? t("savingProfile")}</Loading>
      ) : (
        (children ?? t("saveProfile"))
      )}
    </Button>
  );
}

export { ProfileSaveButton };
