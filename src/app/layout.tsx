import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { IntlProviderServer } from "@/components/ui/extensions/intl-provider-server";
import { ThemeProviderClient } from "@/components/ui/extensions/theme-provider-client";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FirebaseAuthSessionBridgeClient } from "./_components/firebase-auth-session-bridge-client";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense
          fallback={
            <div className="flex min-h-svh items-center justify-center">
              <Spinner
                className="size-8 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          }
        >
          <IntlProviderServer>
            <FirebaseAuthSessionBridgeClient />
            <ThemeProviderClient
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster />
            </ThemeProviderClient>
          </IntlProviderServer>
        </Suspense>
      </body>
    </html>
  );
}
