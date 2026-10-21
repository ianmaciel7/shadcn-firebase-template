import type { ComponentProps } from "react";
import { FieldGroup } from "@/components/ui/field";

type ProfileFormContentProps = ComponentProps<typeof FieldGroup>;

function ProfileFormContent(props: ProfileFormContentProps) {
  return <FieldGroup {...props} />;
}

export { ProfileFormContent };
