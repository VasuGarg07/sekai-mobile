import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";

import googleServices from "../../google-services.json";
import { WEB_APP_URL } from "@/constants";
import { fireAuth } from "@/lib/firebase";
import { registerProfile } from "@/services/profile";

export type AuthResult = { success: true } | { success: false; message: string | null };

const CANCELLED: AuthResult = { success: false, message: null };
const OK: AuthResult = { success: true };

// Google only returns an ID token Firebase accepts when configured with the web OAuth client (type 3).
GoogleSignin.configure({
  webClientId: googleServices.client[0]?.oauth_client.find((c) => c.client_type === 3)?.client_id,
});

const ERROR_MESSAGES: Record<string, string> = {
  "auth/network-request-failed": "Network error, please try again.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/email-already-in-use":
    "An account with this email already exists. Sign in instead, or continue with Google.",
  "auth/account-exists-with-different-credential":
    "An account with this email already exists. Sign in the way you did before.",
  "auth/weak-password": "That password doesn't meet the requirements.",
  "auth/password-does-not-meet-requirements": "That password doesn't meet the requirements.",
  "auth/too-many-requests": "Too many attempts. Please wait a few minutes and try again.",
  "auth/user-disabled": "This account has been disabled.",
};

function getErrorCode(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error) {
    return typeof error.code === "string" ? error.code : undefined;
  }
  return undefined;
}

function toFailure(error: unknown, fallback: string): AuthResult {
  const code = getErrorCode(error);
  return { success: false, message: (code && ERROR_MESSAGES[code]) || fallback };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) return CANCELLED;

    const { idToken } = response.data;
    if (!idToken) {
      return { success: false, message: "Google didn't confirm your account. Please try again." };
    }

    await signInWithCredential(fireAuth, GoogleAuthProvider.credential(idToken));
    return OK;
  } catch (error) {
    if (isErrorWithCode(error)) {
      if (error.code === statusCodes.IN_PROGRESS) return CANCELLED;
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return {
          success: false,
          message: "Google Play services is missing or out of date on this phone.",
        };
      }
    }
    return toFailure(error, "Google sign-in failed. Please try again.");
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    await signInWithEmailAndPassword(fireAuth, email.trim(), password);
    return OK;
  } catch (error) {
    return toFailure(error, "Sign-in failed. Please try again.");
  }
}

export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> {
  let user: User;
  try {
    ({ user } = await createUserWithEmailAndPassword(fireAuth, email.trim(), password));
  } catch (error) {
    return toFailure(error, "Couldn't create your account. Please try again.");
  }

  // The account exists from here on, so a failed name or profile write must not fail the sign-up.
  // The name is set before the verification email is sent because the email greets the user by it,
  // and the profile is re-registered because the auth listener may have written it without the name.
  try {
    await updateProfile(user, { displayName: name.trim() });
    await registerProfile(user);
  } catch (error) {
    console.warn("Couldn't save the display name:", error);
  }
  await sendVerification(user);

  return OK;
}

async function sendVerification(user: User): Promise<AuthResult> {
  try {
    await sendEmailVerification(user, { url: WEB_APP_URL });
    return OK;
  } catch (error) {
    return toFailure(error, "Couldn't send the verification email. Please try again.");
  }
}

export async function resendVerification(): Promise<AuthResult> {
  const user = fireAuth.currentUser;
  if (!user) return { success: false, message: "Sign in to verify your email." };
  return sendVerification(user);
}

/** Reports success for unknown emails too, so the form can't reveal who has an account. */
export async function sendPasswordReset(email: string): Promise<AuthResult> {
  try {
    await sendPasswordResetEmail(fireAuth, email.trim(), { url: WEB_APP_URL });
    return OK;
  } catch (error) {
    if (getErrorCode(error) === "auth/user-not-found") return OK;
    return toFailure(error, "Couldn't send the reset email. Please try again.");
  }
}

export async function signOut(): Promise<void> {
  // Without this, the next Google sign-in silently reuses the account instead of showing the picker.
  await GoogleSignin.signOut().catch(() => undefined);
  await firebaseSignOut(fireAuth);
}
