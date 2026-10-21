import type { ComponentProps } from "react";
import { CardHeader } from "@/components/ui/card";

type ProfileCardHeaderProps = ComponentProps<typeof CardHeader>;

function ProfileCardHeader(props: ProfileCardHeaderProps) {
  return <CardHeader {...props} />;
}

export { ProfileCardHeader };
