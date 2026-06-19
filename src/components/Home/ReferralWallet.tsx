"use client";

import { useState } from "react";
import { getOrCreateWallet, applyReferral, redeemPoints, Wallet } from "@/lib/referralapi";

export default function ReferralWallet() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [refCode, setRefCode] = useState("");
  const [redeemAmt, setRedeemAmt] = useState(100);
  const [msg, setMsg] = useState("");

  const login = () => {
    if (!username.trim()) return;
    const w = getOrCreateWallet(username.trim());
    setWallet({ ...w });
    setLoggedIn(true);
  };

  const refresh = () => {
    const w = getOrCreateWallet(username);
    setWallet({ ...w });
  };

  const handleApplyReferral = () => {
    const result = applyReferral(username, refCode.trim().toUpperCase());
    setMsg(result === "success" ? "✅ Referral applied! You earned 50 points." : `❌ ${result}`);
    refresh();
  };

  const handleRedeem = () => {
    const result = redeemPoints(username, redeemAmt);
    setMsg(result === "success" ? `✅ Redeemed ${redeemAmt} points for a discount!` : `❌ ${result}`);
    refresh();
  };

  if (!loggedIn) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow mt-10">
        <h2 className="text-2xl font-bold text-gray-900">Referral & Wallet</h2>
        <input className="w-full border rounded-lg p-2 mb-3 text-sm" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <button onClick={login} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">Enter</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow mt-10 space-y-5">
      <h2 className="text-2xl font-bold">Referral & Wallet</h2>

      {/* Wallet balance */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-xs text-gray-500 mb-1">Your Balance</p>
        <p className="text-4xl font-bold text-blue-600">{wallet?.balance ?? 0} pts</p>
        <p className="text-xs text-gray-400 mt-1">100 pts = ₹100 discount</p>
      </div>

      {/* Referral code */}
      <div className="border rounded-lg p-4">
        <p className="text-sm font-medium mb-1">Your Referral Code</p>
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono font-bold tracking-widest text-blue-700">{wallet?.referralCode}</span>
          <button onClick={() => { navigator.clipboard.writeText(wallet?.referralCode ?? ""); setMsg("✅ Code copied!"); }}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Copy</button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Share this code — earn 100 pts when a friend joins.</p>
      </div>

      {/* Apply referral */}
      <div className="border rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium">Apply a Referral Code</p>
        <div className="flex gap-2">
          <input className="flex-1 border rounded-lg p-2 text-sm" placeholder="Enter code" value={refCode} onChange={(e) => setRefCode(e.target.value)} />
          <button onClick={handleApplyReferral} className="bg-green-600 text-white px-3 rounded-lg text-sm hover:bg-green-700">Apply</button>
        </div>
      </div>

      {/* Redeem */}
      <div className="border rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium">Redeem Points</p>
        <div className="flex gap-2">
          <input type="number" min={100} step={50} className="flex-1 border rounded-lg p-2 text-sm" value={redeemAmt} onChange={(e) => setRedeemAmt(Number(e.target.value))} />
          <button onClick={handleRedeem} className="bg-orange-500 text-white px-3 rounded-lg text-sm hover:bg-orange-600">Redeem</button>
        </div>
        <p className="text-xs text-gray-400">Minimum 100 pts. Applied as discount on next purchase.</p>
      </div>

      {/* Message */}
      {msg && <p className="text-sm text-center py-2 bg-gray-50 rounded-lg">{msg}</p>}

      {/* Transaction history */}
      <div>
        <p className="text-sm font-medium mb-2">Transaction History</p>
        {wallet?.transactions.length === 0
          ? <p className="text-xs text-gray-400">No transactions yet.</p>
          : wallet?.transactions.map((t, i) => (
              <div key={i} className="flex justify-between text-sm border-b py-1.5">
                <span className="text-gray-600">{t.description}</span>
                <span className={t.points >= 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                  {t.points >= 0 ? "+" : ""}{t.points} pts
                </span>
              </div>
            ))
        }
      </div>
    </div>
  );
}