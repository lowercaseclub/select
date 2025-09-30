"use client";

import { useEffect } from "react";

export function BizzaboScript() {
  useEffect(() => {
    // Only run on client side to avoid hydration mismatch
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id =
      "bz-popup-registration-script-ae887e03-ee3b-4c94-be05-54d63f30b781";
    script.setAttribute("data-event-id", "752577");
    script.setAttribute("data-registration-proxy", "true");
    script.setAttribute("data-unique-name", "752577");
    script.setAttribute("data-flow-id", "ae887e03-ee3b-4c94-be05-54d63f30b781");
    script.setAttribute("data-inline-widget", "true");
    script.setAttribute("data-element-id", "start-registration-button");
    script.setAttribute("data-element-class", "");

    const bizzaboScript = document.createElement("script");
    bizzaboScript.type = "text/javascript";
    bizzaboScript.async = true;
    bizzaboScript.setAttribute(
      "data-flow-id",
      "ae887e03-ee3b-4c94-be05-54d63f30b781"
    );
    bizzaboScript.setAttribute("data-inline-widget", "true");
    bizzaboScript.src =
      "https://organizer.bizzabo.com/widgets/flows/popup/registrationPopup.js";

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode?.insertBefore(bizzaboScript, firstScript);
  }, []);

  return null;
}
