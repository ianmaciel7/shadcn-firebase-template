import type { ComponentProps } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ProfileCardProps = ComponentProps<typeof Card>;

function ProfileCard({ className, ...props }: ProfileCardProps) {
  return (
    <Card className={cn("mx-auto w-full max-w-sm", className)} {...props} />
  );
}

export { ProfileCard };
