"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { GoogleSignInButton } from "@/components/firebase/google-sign-in-button";
import { SignInAuthScreen } from "@/components/firebase/sign-in-auth-screen";
import { getSafeReturnUrl } from "@/lib/auth/return-url";

type SignInFormClientProps = ComponentProps<"div">;

function SignInFormClient(props: SignInFormClientProps) {
  const router = useRouter();
  const destination = getSafeReturnUrl(
    new URLSearchParams(window.location.search).get("next"),
  );
  const nextParam =
    destination === "/profile" ? "" : `?next=${encodeURIComponent(destination)}`;
  return (
    <div {...props}>
      <SignInAuthScreen
        onSignUpClick={() => router.push(`/register${nextParam}`)}
        onForgotPasswordClick={() =>
          router.push(`/forgot-password${nextParam}`)
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
