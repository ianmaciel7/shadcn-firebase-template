import type { ComponentProps } from "react";
import { CardContent } from "@/components/ui/card";

type ProfileCardContentProps = ComponentProps<typeof CardContent>;

function ProfileCardContent(props: ProfileCardContentProps) {
  return <CardContent {...props} />;
}

export { ProfileCardContent };
