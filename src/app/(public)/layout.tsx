import { AuthProvider } from "@/app/_components/auth-provider";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="p-6">
      <AuthProvider>{children}</AuthProvider>
    </main>
  );
}
