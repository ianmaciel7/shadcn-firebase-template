import { ProtectedGate } from "./_components/protected-gate";

export default function ProtectedLayout({ children }: LayoutProps<"/">) {
  return <ProtectedGate>{children}</ProtectedGate>;
}
