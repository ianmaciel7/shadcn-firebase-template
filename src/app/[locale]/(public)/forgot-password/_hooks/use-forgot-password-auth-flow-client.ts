import { useAuthNavigation } from "@/app/[locale]/(public)/_hooks/use-auth-navigation";

export function useForgotPasswordAuthFlowClient() {
  return useAuthNavigation();
}
