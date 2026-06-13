import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
 
  const { userId, token } = req.body;
 
  if (!userId || !token) {
    return res.status(400).json({ error: "userId and token are required" });
  }

  console.log(`FCM token saved for user ${userId}:`, token);
 
  return res.status(200).json({ success: true });
}