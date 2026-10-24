import { useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
import { LabeledSpinner } from "@/components/ui/extensions/labeled-spinner";
import type { ProfileStatus } from "../_hooks/use-profile-status";
import { ProfileCard, ProfileCardContent } from "./profile-card";

type ProfileFallbackProps = ComponentProps<"div"> & {
  status: ProfileStatus;
  children: ReactNode;
};

function ProfileFallback({ status, children, ...props }: ProfileFallbackProps) {
  const t = useTranslations("Auth");

  if (status.status === "hidden") return null;

  if (status.status === "loading") {
    return (
      <div {...props}>
        <LabeledSpinner className="w-full text-sm text-muted-foreground">
          {t("loading")}
        </LabeledSpinner>
      </div>
    );
  }

  if (status.status === "error") {
    return (
      <ProfileCard {...props}>
        <ProfileCardContent>
          <p role="alert">{status.errorMessage}</p>
        </ProfileCardContent>
      </ProfileCard>
    );
  }

  return children;
}

export type { ProfileFallbackProps };
export { ProfileFallback };
