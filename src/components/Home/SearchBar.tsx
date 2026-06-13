"use client";
import { useState } from "react";
import { searchCars, getSuggestions, Filters, Car } from "@/lib/searchapi";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [results, setResults] = useState<Car[] | null>(null);

  const handleInput = (val: string) => {
    setQuery(val);
    setSuggestions(getSuggestions(val));
  };

  const handleSearch = () => {
    setSuggestions([]);
    setResults(searchCars(query, filters));
  };

  const pickSuggestion = (s: string) => {
    setQuery(s);
    setSuggestions([]);
    setResults(searchCars(s, filters));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-4">Search Cars</h2>

      {/* Search input */}
      <div className="relative mb-4">
        <input
          className="w-full border rounded-lg p-2 pr-20"
          placeholder="Search by name or brand…"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} className="absolute right-2 top-2 bg-blue-600 text-white px-3 py-0.5 rounded text-sm">
          Search
        </button>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow">
            {suggestions.map((s) => (
              <li key={s} onClick={() => pickSuggestion(s)} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <select className="border rounded-lg p-2 text-sm" onChange={(e) => setFilters((f) => ({ ...f, fuel: e.target.value || undefined }))}>
          <option value="">All Fuel Types</option>
          {["Petrol", "Diesel", "Electric", "CNG"].map((f) => <option key={f}>{f}</option>)}
        </select>

        <select className="border rounded-lg p-2 text-sm" onChange={(e) => setFilters((f) => ({ ...f, transmission: e.target.value || undefined }))}>
          <option value="">All Transmissions</option>
          <option>Manual</option>
          <option>Automatic</option>
        </select>

        <select className="border rounded-lg p-2 text-sm" onChange={(e) => {
          const val = e.target.value;
          setFilters((f) => ({ ...f, yearMin: val ? Number(val) : undefined }));
        }}>
          <option value="">Year From</option>
          {[2018, 2019, 2020, 2021, 2022, 2023].map((y) => <option key={y}>{y}</option>)}
        </select>

        <div className="flex gap-2">
          <input type="number" placeholder="Min km/l" className="border rounded-lg p-2 text-sm w-full" onChange={(e) => setFilters((f) => ({ ...f, mileageMin: e.target.value ? Number(e.target.value) : undefined }))} />
          <input type="number" placeholder="Max km/l" className="border rounded-lg p-2 text-sm w-full" onChange={(e) => setFilters((f) => ({ ...f, mileageMax: e.target.value ? Number(e.target.value) : undefined }))} />
        </div>
      </div>

      {/* Results */}
      {results !== null && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">{results.length} result(s) found</p>
          {results.length === 0 && <p className="text-gray-400 text-sm">No cars match your search.</p>}
          {results.map((car) => (
            <div key={car.id} className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-semibold">{car.name}</p>
                <p className="text-xs text-gray-500">{car.year} · {car.fuel} · {car.transmission} · {car.mileage} km/l</p>
              </div>
              <p className="font-bold text-blue-600">₹{car.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}