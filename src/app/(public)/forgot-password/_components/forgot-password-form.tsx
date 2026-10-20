"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { ForgotPasswordAuthScreen } from "@/components/firebase/forgot-password-auth-screen";

export type ForgotPasswordFormProps = ComponentProps<"div">;

function ForgotPasswordForm(props: ForgotPasswordFormProps) {
  const router = useRouter();
  return (
    <div {...props}>
      <ForgotPasswordAuthScreen
        onBackToSignInClick={() => router.push("/sign-in")}
      />
    </div>
  );
}

export { ForgotPasswordForm };
