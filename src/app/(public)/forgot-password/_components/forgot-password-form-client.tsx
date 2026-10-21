"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { ForgotPasswordAuthScreen } from "@/components/firebase/forgot-password-auth-screen";

type ForgotPasswordFormClientProps = ComponentProps<"div">;

function ForgotPasswordFormClient(props: ForgotPasswordFormClientProps) {
  const router = useRouter();
  return (
    <div {...props}>
      <ForgotPasswordAuthScreen
        onBackToSignInClick={() => router.push("/sign-in")}
      />
    </div>
  );
}

export { ForgotPasswordFormClient };
