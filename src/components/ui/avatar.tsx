import { Image } from "expo-image";
import { useState } from "react";
import { View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { radius } from "@/theme";
import { createStyles } from "@/theme/create-styles";

interface AvatarProps {
  name: string;
  photoURL?: string | null;
  size?: number;
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function Avatar({ name, photoURL, size = 40 }: AvatarProps) {
  const styles = useStyles();
  const [failed, setFailed] = useState(false);
  const dimensions = { width: size, height: size };

  if (photoURL && !failed) {
    return (
      <Image
        source={photoURL}
        style={[styles.avatar, dimensions]}
        onError={() => setFailed(true)}
        accessibilityLabel={name}
      />
    );
  }

  return (
    <View style={[styles.avatar, styles.fallback, dimensions]} accessibilityLabel={name}>
      <AppText variant={size >= 56 ? "headline" : "label"} tone="onAccent">
        {getInitials(name) || "?"}
      </AppText>
    </View>
  );
}

const useStyles = createStyles(({ colors }) => ({
  avatar: {
    borderRadius: radius.full,
    backgroundColor: colors.surfaceRaised,
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
  },
}));
