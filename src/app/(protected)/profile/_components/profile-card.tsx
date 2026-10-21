import type { ComponentProps } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ProfileCardProps = ComponentProps<typeof Card>;
type ProfileCardHeaderProps = ComponentProps<typeof CardHeader>;
type ProfileCardTitleProps = ComponentProps<typeof CardTitle>;
type ProfileCardDescriptionProps = ComponentProps<typeof CardDescription>;
type ProfileCardContentProps = ComponentProps<typeof CardContent>;
type ProfileCardFooterProps = ComponentProps<typeof CardFooter>;

function ProfileCard({ className, ...props }: ProfileCardProps) {
  return (
    <Card className={cn("mx-auto w-full max-w-sm", className)} {...props} />
  );
}

function ProfileCardAction(props: ComponentProps<typeof CardAction>) {
  return <CardAction {...props} />;
}

function ProfileCardHeader(props: ProfileCardHeaderProps) {
  return <CardHeader {...props} />;
}

function ProfileCardTitle(props: ProfileCardTitleProps) {
  return <CardTitle {...props} />;
}

function ProfileCardDescription(props: ProfileCardDescriptionProps) {
  return <CardDescription {...props} />;
}

function ProfileCardContent(props: ProfileCardContentProps) {
  return <CardContent {...props} />;
}

function ProfileCardFooter(props: ProfileCardFooterProps) {
  return <CardFooter {...props} />;
}

export {
  ProfileCard,
  ProfileCardAction,
  ProfileCardContent,
  ProfileCardDescription,
  ProfileCardFooter,
  ProfileCardHeader,
  ProfileCardTitle,
};
