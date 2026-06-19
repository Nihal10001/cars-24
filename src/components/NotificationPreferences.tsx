"use client";

import { useState, useEffect } from "react";
import { requestNotificationPermission } from "@/lib/notificationHelpers";

type Channel = "push" | "email" | "sms";

interface NotificationEvent {
  id: string;
  label: string;
  description: string;
}

interface Preferences {
  events: Record<string, boolean>;
  channels: Record<Channel, boolean>;
}

const EVENTS: NotificationEvent[] = [
  {
    id: "appointment_confirmation",
    label: "Appointment Confirmations",
    description: "Get notified when an appointment is confirmed or cancelled",
  },
  {
    id: "bid_updates",
    label: "Bid Updates",
    description: "Alerts when a bid is placed, accepted, or rejected",
  },
  {
    id: "price_drops",
    label: "Price Drops",
    description: "Notify me when a tracked item drops in price",
  },
  {
    id: "new_messages",
    label: "New Messages",
    description: "Real-time alerts for incoming messages",
  },
];

const CHANNELS: { id: Channel; label: string; description: string }[] = [
  {
    id: "push",
    label: "Push Notifications",
    description: "Browser & mobile push alerts via FCM",
  },
  {
    id: "email",
    label: "Email",
    description: "Receive updates in your inbox",
  },
  {
    id: "sms",
    label: "SMS",
    description: "Text message alerts on your phone",
  },
];

const DEFAULT_PREFERENCES: Preferences = {
  events: {
    appointment_confirmation: true,
    bid_updates: true,
    price_drops: false,
    new_messages: true,
  },
  channels: {
    push: false,
    email: false,
    sms: false,
  },
};

function Toggle({ on }: { on: boolean }) {
  return (
    <div
      className={`relative w-11 h-6 rounded-full flex-shrink-0 ml-4 transition-colors duration-200 ${
        on ? "bg-[#7c6cff]" : "bg-[#3f3f46]"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
          on ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </div>
  );
}

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch("/api/notifications/preferences?userId=demo-user");
        if (res.ok) {
          const data = await res.json();
          setPreferences(data);
        }
      } catch {}
    };
    fetchPreferences();

    if (typeof window !== "undefined" && Notification.permission === "granted") {
      setPushEnabled(true);
      const stored = localStorage.getItem("fcmToken");
      if (stored) setFcmToken(stored);
    }
  }, []);

  const handleEnablePush = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      setPushEnabled(true);
      setPreferences((prev) => ({ ...prev, channels: { ...prev.channels, push: true } }));
      setSaved(false);
    }
  };

  const toggleEvent = (id: string) => {
    setPreferences((prev) => ({
      ...prev,
      events: { ...prev.events, [id]: !prev.events[id] },
    }));
    setSaved(false);
  };

  const toggleChannel = (id: Channel) => {
    if (id === "push" && !pushEnabled) {
      handleEnablePush();
      return;
    }
    setPreferences((prev) => ({
      ...prev,
      channels: { ...prev.channels, [id]: !prev.channels[id] },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
  setLoading(true);
  try {
      const response = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "demo-user", preferences }),
      });

    if (response.ok) setSaved(true);

    if (fcmToken) {
      await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: fcmToken,
          title: "Cars24 Notification",
          body: "Your notification preferences have been updated successfully.",
        }),
      });
    }
  } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeCard = "border-[#7c6cff] bg-[#1a1830]";
  const inactiveCard = "border-[#2a2a35] bg-[#16161c] hover:border-[#3a3a48]";

  return (
    <div className="w-full font-sans px-4 py-12 flex justify-center">
      <div className="w-full max-w-xl">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-blue-600 font-semibold mb-2">
            Account Settings
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Notification Preferences
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Choose which events you want to be alerted about and how you receive them.
          </p>
        </div>

        {!pushEnabled && !dismissed && (
          <div className="w-full mb-6 rounded-xl border border-[#7c6cff] bg-[#1a1830] px-5 py-4 flex items-start gap-4">
            <span className="text-2xl">🔔</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Enable push notifications</p>
              <p className="text-xs text-[#a1a1aa] mt-0.5">
                Receive instant updates for appointments, bids, price drops and messages.
              </p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => setDismissed(true)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-[#3a3a48] text-[#a1a1aa] hover:bg-[#2a2a35] transition-colors duration-200"
                >
                  Dismiss
                </button>
                <button
                  onClick={handleEnablePush}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#7c6cff] hover:bg-[#6a5be8] text-white transition-colors duration-200"
                >
                  Enable
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#71717a] font-semibold mb-4">
            Alert Events
          </h2>
          <div className="space-y-3">
            {EVENTS.map((event) => (
              <div
                key={event.id}
                role="switch"
                aria-checked={preferences.events[event.id]}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" || e.key === " " ? toggleEvent(event.id) : undefined
                }
                onClick={() => toggleEvent(event.id)}
                className={`flex items-center justify-between rounded-xl border px-5 py-4 cursor-pointer transition-all duration-200 ${
                  preferences.events[event.id] ? activeCard : inactiveCard
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-white">{event.label}</p>
                  <p className="text-xs text-[#71717a] mt-0.5">{event.description}</p>
                </div>
                <Toggle on={preferences.events[event.id]} />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#71717a] font-semibold mb-4">
            Delivery Channels
          </h2>
          <div className="space-y-3">
            {CHANNELS.map((channel) => (
              <div
                key={channel.id}
                role="switch"
                aria-checked={preferences.channels[channel.id]}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" || e.key === " " ? toggleChannel(channel.id) : undefined
                }
                onClick={() => toggleChannel(channel.id)}
                className={`flex items-center justify-between rounded-xl border px-5 py-4 cursor-pointer transition-all duration-200 ${preferences.channels[channel.id] ? activeCard : inactiveCard
                  }`}
              >
                <div>
                  <p className="text-sm font-medium text-white">{channel.label}</p>
                  <p className="text-xs text-[#71717a] mt-0.5">{channel.description}</p>
                </div>
                <Toggle on={preferences.channels[channel.id]} />
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${saved ? "bg-green-600 text-white cursor-default" : "bg-[#7c6cff] hover:bg-[#6a5be8] text-white"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {loading ? "Saving..." : saved ? "✓ Preferences Saved" : "Save Preferences"}
        </button>

      </div>
    </div>
  );
}