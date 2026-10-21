"use client";

import type { ComponentProps } from "react";
import { useAuthNavigation } from "@/app/_hooks/use-auth-navigation";
import { GoogleSignInButton } from "@/components/firebase/google-sign-in-button";
import { SignUpAuthScreen } from "@/components/firebase/sign-up-auth-screen";

type RegisterAuthFlowProps = ComponentProps<"div">;

function RegisterAuthFlow(props: RegisterAuthFlowProps) {
  const { goToSignIn } = useAuthNavigation();
  return (
    <div {...props}>
      <SignUpAuthScreen onSignInClick={goToSignIn}>
        {process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED === "true" ? (
          <GoogleSignInButton />
        ) : null}
      </SignUpAuthScreen>
    </div>
  );
}

export { RegisterAuthFlow };
