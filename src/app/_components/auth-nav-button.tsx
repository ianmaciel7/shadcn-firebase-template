"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useAuthNav } from "../_hooks/use-auth-nav";

function AuthNavButton() {
  const { href, label } = useAuthNav();

  return (
    <Link
      href={href}
      aria-label={label}
      className={buttonVariants({
        variant: "outline",
        className:
          "flex h-12 w-full items-center justify-center rounded-full px-5 text-base font-medium md:w-[158px]",
      })}
    >
      {label}
    </Link>
  );
}

export { AuthNavButton };
