export const NOTIFICATION_EVENTS = [
  { key: "appointment_confirmation", label: "Appointment Confirmations" },
  { key: "bid_updates", label: "Bid Updates" },
  { key: "price_drops", label: "Price Drops" },
  { key: "new_messages", label: "New Messages" },
];
 
export const NOTIFICATION_CHANNELS = [
  { key: "browser", label: "Browser" },
  { key: "mobile", label: "Mobile" },
];
 
export async function saveFCMToken(
  userId: string,
  token: string
) {
  await fetch("/api/notifications/saveToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, token }),
  });
}

export async function savePreferences(userId: string, preferences: object) {
  await fetch("/api/notifications/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, preferences }),
  });
}

export async function getPreferences(userId: string) {
  const res = await fetch(`/api/notifications/preferences?userId=${userId}`);
  if (!res.ok) return null;
  return res.json();
}