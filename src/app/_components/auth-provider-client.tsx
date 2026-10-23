"use client";

import { FirebaseUIProvider } from "@firebase-oss/ui-react";
import type { PropsWithChildren } from "react";
import { Loading } from "@/components/ui/extensions/loading";
import { useAuthProvider } from "../_hooks/use-auth-provider";

type AuthProviderProps = PropsWithChildren;

function AuthProvider({ children }: AuthProviderProps) {
  const state = useAuthProvider();
  const { t } = state;

  if (state.isError)
    return (
      <p
        role="alert"
        className="text-center text-sm font-medium text-destructive"
      >
        {t("configurationError")}
      </p>
    );
  if (state.isLoading)
    return (
      <Loading className="w-full text-sm text-muted-foreground">
        {t("loading")}
      </Loading>
    );
  return <FirebaseUIProvider ui={state.ui}>{children}</FirebaseUIProvider>;
}

export { AuthProvider };
