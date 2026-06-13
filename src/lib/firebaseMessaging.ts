import { getMessaging, onMessage, type Messaging } from "firebase/messaging";
import { app } from "./firebase";

let messaging: Messaging | null = null;

export function initMessaging() {
  if (typeof window === "undefined") return;
  if (messaging) return;

  messaging = getMessaging(app);

  onMessage(messaging, (payload) => {
    new Notification(payload.notification?.title || "Cars24", {
      body: payload.notification?.body || "",
    });
  });
}

export { messaging };