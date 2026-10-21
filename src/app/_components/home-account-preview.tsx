import type { User } from "firebase/auth";
import { Check, Fingerprint, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

function HomeAccountPreview({
  user,
  name,
}: {
  user: User | null;
  name: string;
}) {
  const t = useTranslations("Home");
  return (
    <div className="relative rounded-3xl border bg-muted/40 p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-foreground" />
          {t("yourSpace")}
        </span>
        <span>{"01 / 03"}</span>
      </div>
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-muted">
            <Fingerprint className="size-6" />
          </span>
          <span className="rounded-full border px-2.5 py-1 text-[11px]">
            {user ? t("connected") : t("personal")}
          </span>
        </div>
        <h2 className="mt-6 text-xl font-semibold tracking-tight">
          {user ? name : t("previewTitle")}
        </h2>
        <p className="mt-2 break-all text-sm text-muted-foreground">
          {user?.email || t("previewText")}
        </p>
        <div className="mt-6 space-y-3 border-t pt-5">
          {[t("checkProfile"), t("checkPreferences"), t("checkAccess")].map(
            (label) => (
              <div key={label} className="flex items-center gap-3 text-sm">
                <span className="flex size-5 items-center justify-center rounded-full bg-muted">
                  <Check className="size-3" />
                </span>
                {label}
              </div>
            ),
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-xl border bg-background p-4">
        <Sparkles className="size-5 shrink-0" />
        <p className="text-xs leading-5 text-muted-foreground">
          {user ? t("signedInNote") : t("previewNote")}
        </p>
      </div>
    </div>
  );
}

export { HomeAccountPreview };
