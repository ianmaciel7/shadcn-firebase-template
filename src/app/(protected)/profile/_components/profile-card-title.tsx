import type { ComponentProps } from "react";
import { CardTitle } from "@/components/ui/card";

type ProfileCardTitleProps = ComponentProps<typeof CardTitle>;

function ProfileCardTitle(props: ProfileCardTitleProps) {
  return <CardTitle {...props} />;
}

export { ProfileCardTitle };
