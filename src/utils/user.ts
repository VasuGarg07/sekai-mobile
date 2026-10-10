import type { SekaiUser } from "@/types/user";

const SIGN_IN_METHOD_LABELS: Record<string, string> = {
  "google.com": "Google",
  "github.com": "GitHub",
  password: "Email & password",
};

export function getDisplayName(user: SekaiUser): string {
  return user.displayName || user.email?.split("@")[0] || "User";
}

export function getSignInMethodsLabel(user: SekaiUser): string {
  return user.providers.map((provider) => SIGN_IN_METHOD_LABELS[provider] ?? provider).join(", ");
}

export function hasPassword(user: SekaiUser): boolean {
  return user.providers.includes("password");
}
