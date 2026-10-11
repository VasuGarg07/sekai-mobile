import { ToastAndroid } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

export function showMessage(message: string): void {
  ToastAndroid.show(message, ToastAndroid.SHORT);
}

export function confirmTap(): void {
  ReactNativeHapticFeedback.trigger("impactLight");
}
