import type { ComponentProps, ReactNode } from "react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type LoadingIndicatorProps = ComponentProps<"span"> & {
  label?: ReactNode;
};

function LoadingIndicator({
  label = "Loading…",
  className,
  ...props
}: LoadingIndicatorProps) {
  return (
    <span
      {...props}
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center justify-center gap-2 text-sm text-muted-foreground",
        className,
      )}
    >
      <Spinner
        role="presentation"
        aria-hidden="true"
        aria-label={undefined}
        className="shrink-0 motion-reduce:animate-none"
      />
      <span>{label}</span>
    </span>
  );
}

export { LoadingIndicator };
