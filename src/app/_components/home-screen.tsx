import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";

function HomeScreen({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryAction,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryAction: ReactNode;
}) {
  return (
    <>
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
    </>
  );
}

export { HomeScreen };
