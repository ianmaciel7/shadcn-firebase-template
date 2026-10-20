"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { GoogleSignInButton } from "@/components/firebase/google-sign-in-button";
import { SignUpAuthScreen } from "@/components/firebase/sign-up-auth-screen";

export type RegisterCardClientProps = ComponentProps<"div">;

function RegisterCardClient(props: RegisterCardClientProps) {
  const router = useRouter();
  return (
    <div {...props}>
      <SignUpAuthScreen onSignInClick={() => router.push("/sign-in")}>
        {process.env.NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED === "true" ? (
          <GoogleSignInButton />
        ) : null}
      </SignUpAuthScreen>
    </div>
  );
}

export { RegisterCardClient };
