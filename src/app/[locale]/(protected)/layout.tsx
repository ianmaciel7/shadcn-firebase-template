import { ProtectedGateClient } from "./_components/protected-gate-client";

export default function ProtectedLayout({
  children,
}: LayoutProps<"/[locale]">) {
  return <ProtectedGateClient>{children}</ProtectedGateClient>;
}
