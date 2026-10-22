import type { ComponentProps } from "react";
import { LoadingIndicator } from "@/components/ui/extensions/loading-indicator";
import { cn } from "@/lib/utils";

type LoadingProps = Omit<ComponentProps<typeof LoadingIndicator>, "label">;

function Loading({ className, children, ...props }: LoadingProps) {
  return (
    <LoadingIndicator
      {...props}
      label={children}
      className={cn("text-inherit", className)}
    />
  );
}

export { Loading };
