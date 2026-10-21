import type { ComponentProps } from "react";
import { CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ProfileFormFooterProps = ComponentProps<typeof CardFooter>;

function ProfileFormFooter({
  className,
  ...props
}: ProfileFormFooterProps) {
  return (
    <CardFooter
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

export { ProfileFormFooter };
