import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ProfileFormFooterProps = ComponentProps<"div">;

function ProfileFormFooter({ className, ...props }: ProfileFormFooterProps) {
  return (
    <div className={cn("flex w-full flex-col gap-2", className)} {...props} />
  );
}

export { ProfileFormFooter };
