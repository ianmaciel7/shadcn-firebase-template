"use client";

import type { PropsWithChildren } from "react";
import { LoadingIndicator } from "@/components/ui/extensions/loading-indicator";
import { useProtectedGate } from "../_hooks/use-protected-gate";

type ProtectedGateProps = PropsWithChildren;

function ProtectedGate({ children }: ProtectedGateProps) {
  const { t, isLoading, isError, errorKey } = useProtectedGate();

  if (isError) {
    return (
      <main className="flex min-h-svh flex-1 items-center justify-center p-6 md:p-10">
        <p role="alert">{t(errorKey)}</p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-svh flex-1 items-center justify-center p-6 md:p-10">
        <LoadingIndicator className="text-sm text-muted-foreground">
          {t("loading")}
        </LoadingIndicator>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh flex-1 items-center justify-center p-6 md:p-10">
      {children}
    </main>
  );
}

export { ProtectedGate };
