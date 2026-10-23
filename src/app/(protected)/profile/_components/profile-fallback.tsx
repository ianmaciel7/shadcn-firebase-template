import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { LabeledSpinner } from "@/components/ui/extensions/labeled-spinner";
import type { ProfileStatus } from "../_hooks/use-profile-status";
import { ProfileCard, ProfileCardContent } from "./profile-card";

type ProfileFallbackProps = ComponentProps<"div"> & {
  status: ProfileStatus;
};

function ProfileFallback({ status, ...props }: ProfileFallbackProps) {
  const t = useTranslations("Auth");

  if (status.isHidden) return null;

  if (status.isLoading) {
    return (
      <div {...props}>
        <LabeledSpinner className="w-full text-sm text-muted-foreground">
          {t("loading")}
        </LabeledSpinner>
      </div>
    );
  }

  if (status.isError) {
    return (
      <ProfileCard {...props}>
        <ProfileCardContent>
          <p role="alert">{status.errorMessage}</p>
        </ProfileCardContent>
      </ProfileCard>
    );
  }

  return props.children;
}

export { ProfileFallback };
