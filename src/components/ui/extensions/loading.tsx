import type { ComponentProps } from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type LoadingProps = ComponentProps<"span">;

function Loading({ className, children, ...props }: LoadingProps) {
  return (
    <span
      {...props}
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center justify-center gap-2", className)}
    >
      <Spinner role="presentation" aria-hidden="true" aria-label={undefined} />
      {children}
    </span>
  );
}

export { Loading };
