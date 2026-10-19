import { AuthProvider } from "@/app/_components/auth-provider";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex min-h-svh flex-1 items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthProvider>{children}</AuthProvider>
      </div>
    </main>
  );
}
