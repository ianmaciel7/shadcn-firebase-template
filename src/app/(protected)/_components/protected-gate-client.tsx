"use client";

import type { PropsWithChildren } from "react";
import { Loading } from "@/components/ui/extensions/loading";
import { useProtectedGate } from "../_hooks/use-protected-gate";

type ProtectedGateProps = PropsWithChildren;

function ProtectedGate({ children }: ProtectedGateProps) {
  const { t, isLoading, hasError, errorKey } = useProtectedGate();

  if (hasError) {
    return (
      <main className="flex min-h-svh flex-1 items-center justify-center p-6 md:p-10">
        <p role="alert">{t(errorKey)}</p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-svh flex-1 items-center justify-center p-6 md:p-10">
        <Loading className="text-sm text-muted-foreground">
          {t("loading")}
        </Loading>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh flex-1 items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">{children}</div>
    </main>
  );
}

export { ProtectedGate };
