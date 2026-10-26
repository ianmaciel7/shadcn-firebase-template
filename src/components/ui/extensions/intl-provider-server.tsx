import "server-only";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type * as React from "react";

async function IntlProviderServer({
  children,
  ...props
}: Omit<
  React.ComponentProps<typeof NextIntlClientProvider>,
  "locale" | "messages"
>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider {...props} locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

async function IntlDocumentServer({
  className,
  children,
}: Pick<React.ComponentProps<"html">, "className" | "children">) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={className} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

export { IntlDocumentServer, IntlProviderServer };
