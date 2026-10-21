import type { ComponentProps } from "react";
import { CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

type ProfileFormContentProps = ComponentProps<typeof CardContent>;

function ProfileFormContent({ children, ...props }: ProfileFormContentProps) {
  return (
    <CardContent {...props}>
      <FieldGroup>{children}</FieldGroup>
    </CardContent>
  );
}

export { ProfileFormContent };
