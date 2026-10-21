import type { ComponentProps } from "react";
import { CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

type ProfileFormContentProps = ComponentProps<typeof CardContent>;

function ProfileFormContent({ children, ...props }: ProfileFormContentProps) {
  return (
    <CardContent {...props}>
      <FieldGroup className="gap-5">{children}</FieldGroup>
    </CardContent>
  );
}

export { ProfileFormContent };
