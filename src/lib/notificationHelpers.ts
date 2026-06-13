import { getToken, getMessaging, type Messaging } from "firebase/messaging";
import { app } from "./firebase";
import { saveFCMToken } from "./notificationservice";

let messaging: Messaging | null = null;
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export { messaging };

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    if (!messaging) return null;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (!token) return null;

    localStorage.setItem("fcmToken", token);
    await saveFCMToken("demo-user", token);

    return token;
  } catch (error) {
    console.error("FCM Error:", error);
    return null;
  }
}