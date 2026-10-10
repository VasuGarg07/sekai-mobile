import type { User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

import { fireStore } from "@/lib/firebase";

// Keep in sync with sekai-web: firestore.rules only accepts this exact profile shape.
export async function registerProfile(user: User): Promise<void> {
  const ref = doc(fireStore, "profiles", user.uid);
  const snapshot = await getDoc(ref);
  const current = {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };

  if (!snapshot.exists()) {
    await setDoc(ref, { uid: user.uid, ...current, createdAt: serverTimestamp() });
    return;
  }

  const stored = snapshot.data();
  const changed = Object.fromEntries(
    Object.entries(current).filter(([key, value]) => stored[key] !== value),
  );
  if (Object.keys(changed).length > 0) {
    await updateDoc(ref, changed);
  }
}
