"use client";

import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { cities, cityCenters, getCentersByCity, getListingsByCity, ServiceCenter } from "@/lib/geoapi";

const MAP_STYLE = { width: "100%", height: "320px" };

export default function GeoFence() {
  const [city, setCity] = useState("");
  const [activeMarker, setActiveMarker] = useState<ServiceCenter | null>(null);
  const [locating, setLocating] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "",
  });

  const listings = city ? getListingsByCity(city) : [];
  const centers = city ? getCentersByCity(city) : [];
  const mapCenter = city ? cityCenters[city] : { lat: 20.5937, lng: 78.9629 };

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
        );
        const data = await res.json();
        const components: { types: string[]; long_name: string }[] = data.results?.[0]?.address_components ?? [];
        const cityComp = components.find((c) => c.types.includes("locality"));
        const detected = cityComp?.long_name ?? "";
        const matched = cities.find((c) => c.toLowerCase() === detected.toLowerCase());
        if (matched) setCity(matched);
        else alert(`Your city (${detected}) is not in our coverage area yet.`);
        setLocating(false);
      },
      () => { alert("Could not get location."); setLocating(false); }
    );
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-1">Cars Near You</h2>
      <p className="text-gray-500 text-sm mb-5">Select your city or detect location to see local listings and service hubs.</p>

      <div className="flex gap-2 mb-5">
        <select className="flex-1 border rounded-lg p-2 text-sm" value={city} onChange={(e) => { setCity(e.target.value); setActiveMarker(null); }}>
          <option value="">Select City</option>
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button onClick={detectLocation} disabled={locating} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60">
          {locating ? "Detecting…" : "📍 Detect"}
        </button>
      </div>

      {isLoaded && (
        <div className="rounded-xl overflow-hidden border mb-5">
          <GoogleMap zoom={city ? 12 : 5} center={mapCenter} mapContainerStyle={MAP_STYLE}>
            {centers.map((sc) => (
              <Marker key={sc.name} position={{ lat: sc.lat, lng: sc.lng }} title={sc.name} onClick={() => setActiveMarker(sc)} />
            ))}
            {activeMarker && (
              <InfoWindow position={{ lat: activeMarker.lat, lng: activeMarker.lng }} onCloseClick={() => setActiveMarker(null)}>
                <div className="text-sm font-medium p-1">{activeMarker.name}</div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      )}

      {city && (
        <div>
          <p className="text-sm text-gray-500 mb-3">{listings.length} listing(s) in {city}</p>
          {listings.length === 0
            ? <p className="text-gray-400 text-sm">No listings available in this city.</p>
            : listings.map((l) => (
                <div key={l.id} className="border rounded-lg p-3 flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-sm">{l.name}</p>
                    <p className="text-xs text-gray-400">{l.type} · {l.city}</p>
                  </div>
                  <p className="font-bold text-blue-600 text-sm">₹{l.price.toLocaleString()}</p>
                </div>
              ))
          }
        </div>
      )}
    </div>
  );
}