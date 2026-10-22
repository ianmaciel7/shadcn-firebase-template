import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type HomeHeroProps = ComponentProps<"div">;

function HomeHero({ className, ...props }: HomeHeroProps) {
  return <div {...props} className={cn("flex flex-col gap-8", className)} />;
}

type HomeHeroHeaderProps = ComponentProps<"div">;

function HomeHeroHeader({ className, ...props }: HomeHeroHeaderProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col items-center gap-6 text-center sm:items-start sm:text-left",
        className,
      )}
    />
  );
}

type HomeHeroTitleProps = ComponentProps<"h1">;

function HomeHeroTitle({ className, ...props }: HomeHeroTitleProps) {
  return (
    <h1
      {...props}
      className={cn(
        "max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground",
        className,
      )}
    />
  );
}

type HomeHeroDescriptionProps = ComponentProps<"p">;

function HomeHeroDescription({
  className,
  ...props
}: HomeHeroDescriptionProps) {
  return (
    <p
      {...props}
      className={cn(
        "max-w-md text-lg leading-8 text-muted-foreground",
        className,
      )}
    />
  );
}

type HomeHeroActionsProps = ComponentProps<"div">;

function HomeHeroActions({ className, ...props }: HomeHeroActionsProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col gap-4 text-base font-medium sm:flex-row w-full sm:w-auto",
        className,
      )}
    />
  );
}

export type {
  HomeHeroActionsProps,
  HomeHeroDescriptionProps,
  HomeHeroHeaderProps,
  HomeHeroProps,
  HomeHeroTitleProps,
};
export {
  HomeHero,
  HomeHeroActions,
  HomeHeroDescription,
  HomeHeroHeader,
  HomeHeroTitle,
};
