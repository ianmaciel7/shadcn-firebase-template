import { ProtectedGate } from "./_components/protected-gate-client";

export default function ProtectedLayout({ children }: LayoutProps<"/">) {
  return <ProtectedGate>{children}</ProtectedGate>;
}
