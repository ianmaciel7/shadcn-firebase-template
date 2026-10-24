import { ProtectedGuardClient } from "./_components/protected-guard-client";

export default function ProtectedLayout({ children }: LayoutProps<"/">) {
  return <ProtectedGuardClient>{children}</ProtectedGuardClient>;
}
