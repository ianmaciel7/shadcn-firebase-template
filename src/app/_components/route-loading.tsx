import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { Loading } from "@/components/ui/extensions/loading";
import { cn } from "@/lib/utils";

type RouteLoadingProps = ComponentProps<typeof Loading>;

function RouteLoading({ className, label, ...props }: RouteLoadingProps) {
  const t = useTranslations("App");
  return (
    <Loading
      label={label ?? t("loading")}
      className={cn("flex w-full p-6", className)}
      {...props}
    />
  );
}

export { RouteLoading };
