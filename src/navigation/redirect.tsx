import { useEffect } from "react";

import { router } from "./router";

interface RedirectProps {
  to: "home" | "profile";
}

/** Leaves the current screen for the tabs. Renders nothing. */
export function Redirect({ to }: RedirectProps) {
  useEffect(() => {
    if (to === "profile") router.showTab("Profile");
    else router.goHome();
  }, [to]);

  return null;
}
