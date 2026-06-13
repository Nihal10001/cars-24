"use client";

import { useState } from "react";
import { estimateMaintenance, brands } from "@/lib/maintenance";

export default function MaintenanceCostEstimator() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [age, setAge] = useState(3);
  const [km, setKm] = useState(30000);
  const [result, setResult] = useState<ReturnType<typeof estimateMaintenance> | null>(null);

  const handleEstimate = () => {
    if (!brand || !model) return alert("Please select a brand and model");
    setResult(estimateMaintenance(`${brand} ${model}`, age, km));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-1">Maintenance Cost Estimator</h2>
      <p className="text-gray-500 text-sm mb-6">Estimate future upkeep costs before you buy.</p>

      <div className="space-y-4">
        <select className="w-full border rounded-lg p-2" value={brand} onChange={(e) => { setBrand(e.target.value); setModel(""); }}>
          <option value="">Select Brand</option>
          {Object.keys(brands).map((b) => <option key={b}>{b}</option>)}
        </select>

        <select className="w-full border rounded-lg p-2" value={model} disabled={!brand} onChange={(e) => setModel(e.target.value)}>
          <option value="">Select Model</option>
          {(brands[brand] ?? []).map((m) => <option key={m}>{m}</option>)}
        </select>

        <div>
          <label className="text-sm text-gray-600">Car Age: {age} years</label>
          <input type="range" min={1} max={15} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>

        <div>
          <label className="text-sm text-gray-600">KM Driven: {km.toLocaleString()} km</label>
          <input type="range" min={5000} max={150000} step={5000} value={km} onChange={(e) => setKm(Number(e.target.value))} className="w-full accent-blue-600" />
        </div>

        <button onClick={handleEstimate} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
          Estimate
        </button>
      </div>

      {result && (
        <div className="mt-6 border-t pt-5 space-y-3">
          <p className="font-semibold text-lg text-orange-600">{result.rating}</p>
          <div className="flex gap-4">
            <div className="bg-gray-50 rounded-lg p-3 flex-1 text-center">
              <p className="text-xs text-gray-500">Monthly</p>
              <p className="text-2xl font-bold">₹{result.monthly.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 flex-1 text-center">
              <p className="text-xs text-gray-500">Yearly</p>
              <p className="text-2xl font-bold">₹{result.yearly.toLocaleString()}</p>
            </div>
          </div>
          <ul className="space-y-2">
            {result.insights.map((ins, i) => (
              <li key={i} className="text-sm bg-blue-50 text-blue-800 px-3 py-2 rounded-lg">• {ins}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
