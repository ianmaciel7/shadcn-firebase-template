"use client";

import { useUI, type OAuthButtonProps, useSignInWithProvider } from "@firebase-oss/ui-react";
import { Button } from "@/components/ui/button";
import { LoadingIndicator } from "@/components/ui/extensions/loading-indicator";

export type { OAuthButtonProps };

export function OAuthButton({ provider, children, themed, onSignIn }: OAuthButtonProps) {
  const ui = useUI();

  const { error, callback } = useSignInWithProvider(provider, onSignIn);

  return (
    <div>
      <Button
        type="button"
        disabled={ui.state !== "idle"}
        aria-busy={ui.state !== "idle"}
        onClick={callback}
        data-provider={provider.providerId}
        data-themed={themed}
        className="w-full"
        variant={themed ? "default" : "outline"}
      >
        {ui.state !== "idle" ? (
          <LoadingIndicator label={children} className="text-inherit" />
        ) : (
          children
        )}
      </Button>
      {error && <div className="text-destructive text-left text-xs">{error}</div>}
    </div>
  );
}
