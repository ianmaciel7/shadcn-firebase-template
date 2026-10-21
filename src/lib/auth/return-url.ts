/** Accept only application-relative destinations after authentication. */
export function getSafeReturnUrl(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\u0000-\u001f\u007f]/.test(value)) {
    return "/profile";
  }

  try {
    const url = new URL(value, "https://app.local");
    if (url.origin !== "https://app.local" || /^\/(?:sign-in|register|forgot-password)(?:\/|$)/.test(url.pathname)) {
      return "/profile";
    }
    return url.pathname + url.search + url.hash;
  } catch {
    return "/profile";
  }
}
