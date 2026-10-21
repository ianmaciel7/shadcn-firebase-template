"use client";

import type { ComponentProps } from "react";
import { GoogleSignInButton } from "@/components/firebase/google-sign-in-button";
import { SignInAuthScreen as SignInAuthContent } from "@/components/firebase/sign-in-auth-screen";
import { useSignInAuthFlow } from "../_hooks/use-sign-in-auth-flow";

type SignInAuthFlowProps = ComponentProps<"div">;

function SignInAuthFlow(props: SignInAuthFlowProps) {
  const { goToRegister, goToForgotPassword } = useSignInAuthFlow();
  return (
    <div {...props}>
      <SignInAuthContent
        onSignUpClick={goToRegister}
        onForgotPasswordClick={goToForgotPassword}
      >
        {process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED === "true" ? (
          <GoogleSignInButton />
        ) : null}
      </SignInAuthContent>
    </div>
  );
}

export { SignInAuthFlow };
