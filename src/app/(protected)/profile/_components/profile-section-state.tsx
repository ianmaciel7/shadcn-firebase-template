import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { LabeledSpinner } from "@/components/ui/extensions/labeled-spinner";
import type { ProfileStatus } from "../_hooks/use-profile-status";
import { ProfileCard, ProfileCardContent } from "./profile-card";

type ProfileSectionStateProps = ComponentProps<"div"> & {
  state: ProfileStatus;
};

function ProfileSectionState({ state, ...props }: ProfileSectionStateProps) {
  const t = useTranslations("Auth");

  if (state.isHidden) return null;

  if (state.isLoading) {
    return (
      <div {...props}>
        <LabeledSpinner className="w-full text-sm text-muted-foreground">
          {t("loading")}
        </LabeledSpinner>
      </div>
    );
  }

  if (state.isError) {
    return (
      <ProfileCard {...props}>
        <ProfileCardContent>
          <p role="alert">{state.errorMessage}</p>
        </ProfileCardContent>
      </ProfileCard>
    );
  }

  return props.children;
}

export { ProfileSectionState };
