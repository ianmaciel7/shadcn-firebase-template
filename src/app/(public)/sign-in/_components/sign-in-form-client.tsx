"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { GoogleSignInButton } from "@/components/firebase/google-sign-in-button";
import { SignInAuthScreen } from "@/components/firebase/sign-in-auth-screen";
import { getAuthNavigationUrl } from "@/lib/auth/return-url";

type SignInFormClientProps = ComponentProps<"div">;

function SignInFormClient(props: SignInFormClientProps) {
  const router = useRouter();
  return (
    <div {...props}>
      <SignInAuthScreen
        onSignUpClick={() =>
          router.push(getAuthNavigationUrl("/register", window.location.search))
        }
        onForgotPasswordClick={() =>
          router.push(
            getAuthNavigationUrl("/forgot-password", window.location.search),
          )
        }
      >
        {process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED === "true" ? (
          <GoogleSignInButton />
        ) : null}
      </SignInAuthScreen>
    </div>
  );
}

export { SignInFormClient };
