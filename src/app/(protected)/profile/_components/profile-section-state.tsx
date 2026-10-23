import { useTranslations } from "next-intl";
import type { ComponentProps, PropsWithChildren } from "react";
import { LabeledSpinner } from "@/components/ui/extensions/labeled-spinner";
import { ProfileCard, ProfileCardContent } from "./profile-card";

type ProfileSectionStateProps = PropsWithChildren<
  ComponentProps<"div"> & {
    isError: boolean;
    isHidden: boolean;
    isLoading: boolean;
    message: string;
  }
>;

function ProfileSectionState({
  children,
  isError,
  isHidden,
  isLoading,
  message,
  ...props
}: ProfileSectionStateProps) {
  const t = useTranslations("Auth");

  if (isHidden) return null;

  if (isLoading) {
    return (
      <div {...props}>
        <LabeledSpinner className="w-full text-sm text-muted-foreground">
          {t("loading")}
        </LabeledSpinner>
      </div>
    );
  }

  if (isError) {
    return (
      <ProfileCard {...props}>
        <ProfileCardContent>
          <p role="alert">{message}</p>
        </ProfileCardContent>
      </ProfileCard>
    );
  }

  return children;
}

export { ProfileSectionState };
