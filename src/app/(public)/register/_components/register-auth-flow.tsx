"use client";

import type { ComponentProps } from "react";
import { GoogleSignInButton } from "@/components/firebase/google-sign-in-button";
import { SignUpAuthScreen as SignUpAuthContent } from "@/components/firebase/sign-up-auth-screen";
import { useRegisterAuthFlow } from "../_hooks/use-register-auth-flow";

type RegisterAuthFlowProps = ComponentProps<"div">;

function RegisterAuthFlow(props: RegisterAuthFlowProps) {
  const { goToSignIn } = useRegisterAuthFlow();
  return (
    <div {...props}>
      <SignUpAuthContent onSignInClick={goToSignIn}>
        {process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED === "true" ? (
          <GoogleSignInButton />
        ) : null}
      </SignUpAuthContent>
    </div>
  );
}

export { RegisterAuthFlow };
