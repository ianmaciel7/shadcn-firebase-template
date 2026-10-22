import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HomePresentationProps = ComponentProps<"div"> & {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryAction: ReactNode;
};

function HomePresentation({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryAction,
  className,
  ...props
}: HomePresentationProps) {
  return (
    <div {...props} className={cn("flex flex-col gap-8", className)}>
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
          {title}
        </h1>
        <p className="max-w-md text-lg leading-8 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex flex-col gap-4 text-base font-medium sm:flex-row w-full sm:w-auto">
        <Link
          href={primaryHref}
          className={buttonVariants({
            className:
              "flex h-12 w-full items-center justify-center rounded-full px-5 text-base font-medium md:w-[158px]",
          })}
        >
          {primaryLabel}
        </Link>
        {secondaryAction}
      </div>
    </div>
  );
}

export { HomePresentation };
