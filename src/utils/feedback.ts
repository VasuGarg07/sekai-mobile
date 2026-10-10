import * as Haptics from "expo-haptics";
import { ToastAndroid } from "react-native";

export function showMessage(message: string): void {
  ToastAndroid.show(message, ToastAndroid.SHORT);
}

export function confirmTap(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
}
