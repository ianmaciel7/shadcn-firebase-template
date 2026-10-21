import type { ComponentProps } from "react";
import { CardDescription } from "@/components/ui/card";

type ProfileCardDescriptionProps = ComponentProps<typeof CardDescription>;

function ProfileCardDescription(props: ProfileCardDescriptionProps) {
  return <CardDescription {...props} />;
}

export { ProfileCardDescription };
