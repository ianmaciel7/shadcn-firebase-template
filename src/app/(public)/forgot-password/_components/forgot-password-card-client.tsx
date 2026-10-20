"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { ForgotPasswordAuthScreen } from "@/components/firebase/forgot-password-auth-screen";

export type ForgotPasswordCardClientProps = ComponentProps<"div">;

function ForgotPasswordCardClient(props: ForgotPasswordCardClientProps) {
  const router = useRouter();
  return (
    <div {...props}>
      <ForgotPasswordAuthScreen
        onBackToSignInClick={() => router.push("/sign-in")}
      />
    </div>
  );
}

export { ForgotPasswordCardClient };
