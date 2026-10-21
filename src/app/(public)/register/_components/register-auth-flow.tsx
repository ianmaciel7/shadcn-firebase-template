"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { GoogleSignInButton } from "@/components/firebase/google-sign-in-button";
import { SignUpAuthScreen } from "@/components/firebase/sign-up-auth-screen";
import { getAuthNavigationUrl } from "@/lib/auth/return-url";

type RegisterAuthFlowProps = ComponentProps<"div">;

function RegisterAuthFlow(props: RegisterAuthFlowProps) {
  const router = useRouter();
  return (
    <div {...props}>
      <SignUpAuthScreen
        onSignInClick={() =>
          router.push(getAuthNavigationUrl("/sign-in", window.location.search))
        }
      >
        {process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED === "true" ? (
          <GoogleSignInButton />
        ) : null}
      </SignUpAuthScreen>
    </div>
  );
}

export { RegisterAuthFlow };
