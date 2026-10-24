import { useAuthNavigation } from "@/app/[locale]/(public)/_hooks/use-auth-navigation";

export function useSignInAuthFlowClient() {
  return useAuthNavigation();
}
