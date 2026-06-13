import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
 
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("SEND BODY:", req.body);
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
 
  const { token, title, body, eventType } = req.body;
 
  if (!token || !title || !body) {
    return res.status(400).json({ error: "token, title, and body are required" });
  }
 
  const message = {
    token,
    notification: { title, body },
    data: { eventType: eventType || "" },
  };
 
  try {
  const messageId =
    await getMessaging().send(message);
    console.log("Firebase response:", messageId);
  
  return res.status(200).json({
    success: true,
    messageId,
  });
  } catch (error) {
    console.error(
      "Firebase Send Error:",
      error
    );

    return res.status(500).json({
      error: String(error),
    });
  }
}