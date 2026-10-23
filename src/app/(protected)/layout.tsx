import { ProtectedGateClient } from "./_components/protected-gate-client";

export default function ProtectedLayout({ children }: LayoutProps<"/">) {
  return <ProtectedGateClient>{children}</ProtectedGateClient>;
}
