import { Redirect, useLocalSearchParams } from "expo-router";

import { DefaultStatusSheet } from "@/screens/settings-sheet/default-status-sheet";
import { ExportSheet } from "@/screens/settings-sheet/export-sheet";
import { SetPasswordSheet } from "@/screens/settings-sheet/set-password-sheet";
import { SignOutSheet } from "@/screens/settings-sheet/sign-out-sheet";
import { VerifyEmailSheet } from "@/screens/settings-sheet/verify-email-sheet";

const SHEETS = {
  "default-status": DefaultStatusSheet,
  export: ExportSheet,
  "set-password": SetPasswordSheet,
  "sign-out": SignOutSheet,
  "verify-email": VerifyEmailSheet,
};

function isSheetName(value: string): value is keyof typeof SHEETS {
  return typeof value === "string" && Object.hasOwn(SHEETS, value);
}

export default function SettingsSheetRoute() {
  const { sheet } = useLocalSearchParams<{ sheet: string }>();
  if (!isSheetName(sheet)) return <Redirect href="/profile" />;

  const Sheet = SHEETS[sheet];
  return <Sheet />;
}
