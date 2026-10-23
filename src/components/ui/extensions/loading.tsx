import type { ComponentProps } from "react";
import { LoadingIndicator } from "@/components/ui/extensions/loading-indicator";
import { cn } from "@/lib/utils";

type LoadingProps = Omit<ComponentProps<typeof LoadingIndicator>, "label">;

/**
 * @deprecated Use `LoadingIndicator`, which now accepts `children` directly.
 */
function Loading({ className, children, ...props }: LoadingProps) {
  return (
    <LoadingIndicator {...props} className={cn("text-inherit", className)}>
      {children}
    </LoadingIndicator>
  );
}

export { Loading };
