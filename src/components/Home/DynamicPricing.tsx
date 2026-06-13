"use client";

import { useState } from "react";
import { getRecommendedPrice, regions } from "@/lib/pricingapi";

export default function DynamicPricing() {
  const [basePrice, setBasePrice] = useState(500000);
  const [carType, setCarType] = useState<"suv" | "hatchback" | "sedan">("suv");
  const [region, setRegion] = useState("");
  const [result, setResult] = useState<ReturnType<typeof getRecommendedPrice> | null>(null);

  const handleCalculate = () => {
    if (!region) return alert("Please select a region");
    setResult(getRecommendedPrice(basePrice, carType, region));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-1">Dynamic Pricing Engine</h2>
      <p className="text-gray-500 text-sm mb-6">See the recommended market price based on your region and current season.</p>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-600">Base Price: ₹{basePrice.toLocaleString()}</label>
          <input type="range" min={200000} max={3000000} step={50000} value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>

        <select className="w-full border rounded-lg p-2" value={carType} onChange={(e) => setCarType(e.target.value as any)}>
          <option value="suv">SUV</option>
          <option value="hatchback">Hatchback</option>
          <option value="sedan">Sedan</option>
        </select>

        <select className="w-full border rounded-lg p-2" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">Select Region</option>
          {regions.map((r) => <option key={r}>{r}</option>)}
        </select>

        <button onClick={handleCalculate} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
          Get Recommended Price
        </button>
      </div>

      {result && (
        <div className="mt-6 border-t pt-5 space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">Recommended Price</p>
            <p className="text-3xl font-bold text-green-700">₹{result.recommended.toLocaleString()}</p>
            <p className={`text-sm mt-1 font-medium ${result.diff >= 0 ? "text-green-600" : "text-red-500"}`}>
              {result.diff >= 0 ? "+" : ""}₹{result.diff.toLocaleString()} vs base price
            </p>
          </div>
          <p className="text-sm bg-blue-50 text-blue-800 px-3 py-2 rounded-lg">📍 {result.reason}</p>
          <p className="text-xs text-gray-400">Season: <span className="capitalize font-medium">{result.season}</span> · Region: {result.region}</p>
        </div>
      )}
    </div>
  );
}
