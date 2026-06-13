import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  if (req.method === "GET") {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ error: "userId is required" });

    const prefs = {
      events: {
        appointment_confirmation: true,
        bid_updates: true,
        price_drops: false,
        new_messages: true,
      },
      channels: {
        push: true,
        email: false,
        sms: false,
      },
    };

    return res.status(200).json(prefs);
  }
 
  if (req.method === "POST") {
    const { userId, preferences } = req.body;
 
    if (!userId || !preferences) {
      return res.status(400).json({ error: "userId and preferences are required" });
    }

    console.log(`Preferences saved for user ${userId}:`, preferences);
 
    return res.status(200).json({ success: true });
  }
 
  return res.status(405).json({ error: "Method not allowed" });
}