import { Image, View, type ImageStyle, type StyleProp, type ViewStyle } from "react-native";

interface RemoteImageProps {
  /** Image URL; an empty box with the same style is drawn when it is missing. */
  uri?: string | null;
  style?: StyleProp<ImageStyle>;
  fit?: "cover" | "contain";
  /** Cross-fade in milliseconds once the image has loaded (Android only). */
  fadeMs?: number;
  accessibilityLabel?: string;
  onError?: () => void;
}

export function RemoteImage({
  uri,
  style,
  fit = "cover",
  fadeMs,
  accessibilityLabel,
  onError,
}: RemoteImageProps) {
  if (!uri) {
    // The cast is safe: the styles passed here only set size, radius and background, which View accepts too.
    return <View style={style as StyleProp<ViewStyle>} accessibilityLabel={accessibilityLabel} />;
  }
  return (
    <Image
      source={{ uri }}
      style={style}
      resizeMode={fit}
      fadeDuration={fadeMs}
      accessibilityLabel={accessibilityLabel}
      onError={onError}
    />
  );
}
