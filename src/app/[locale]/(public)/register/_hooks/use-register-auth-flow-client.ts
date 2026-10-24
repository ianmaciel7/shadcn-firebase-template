import { useAuthNavigation } from "@/app/[locale]/(public)/_hooks/use-auth-navigation";

export function useRegisterAuthFlowClient() {
  return useAuthNavigation();
}
