import { Pressable, type PressableProps } from "react-native";

import { AppText } from "@/components/ui/app-text";

interface TextLinkProps extends Omit<PressableProps, "children"> {
  title: string;
  tone?: "accent" | "muted";
}

export function TextLink({ title, tone = "accent", ...pressableProps }: TextLinkProps) {
  return (
    <Pressable accessibilityRole="button" hitSlop={8} {...pressableProps}>
      <AppText variant="label" tone={tone}>
        {title}
      </AppText>
    </Pressable>
  );
}
