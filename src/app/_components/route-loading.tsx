import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { LoadingIndicator } from "@/components/ui/extensions/loading-indicator";
import { cn } from "@/lib/utils";

type RouteLoadingProps = ComponentProps<typeof LoadingIndicator>;

function RouteLoading({ className, label, ...props }: RouteLoadingProps) {
  const t = useTranslations("App");
  return (
    <LoadingIndicator
      label={label ?? t("loading")}
      className={cn("flex w-full p-6", className)}
      {...props}
    />
  );
}

export { RouteLoading };
