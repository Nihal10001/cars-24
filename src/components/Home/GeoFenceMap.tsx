"use client";
import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { cities, cityCenters, getCentersByCity, getListingsByCity } from "@/lib/geoapi";
import { useMap } from "react-leaflet";

const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

function RecenterMap({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom);
  }, [lat, lng, zoom, map]);
  return null;
}

export default function GeoFenceMap() {
  const [city, setCity] = useState("");
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);

  const listings = city ? getListingsByCity(city) : [];
  const centers = city ? getCentersByCity(city) : [];
  const mapCenter = city ? cityCenters[city] : { lat: 20.5937, lng: 78.9629 };
  const zoomLevel = city ? 12 : 5;

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let nearest = cities[0];
        let minDist = Infinity;
        for (const c of cities) {
          const d = Math.hypot(cityCenters[c].lat - latitude, cityCenters[c].lng - longitude);
          if (d < minDist) { minDist = d; nearest = c; }
        }
        setCity(nearest);
        setLocating(false);
      },
      (err) => {
        console.error("Geolocation error:", err.code, err.message);
        alert(`Could not get location: ${err.message}`);
        setLocating(false);
      },
      { timeout: 20000, enableHighAccuracy: false, maximumAge: 60000 }
    );
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <h2 className="text-2xl font-bold mb-1 text-gray-900">Cars Near You</h2>
      <p className="text-gray-600 text-sm mb-5">Select your city or detect location.</p>

      <div className="flex gap-2 mb-5">
        <select className="flex-1 border rounded-lg p-2 text-sm" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Select City</option>
          {cities.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button onClick={detectLocation} disabled={locating} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60">
          {locating ? "Detecting…" : "📍 Detect"}
        </button>
      </div>
      {city && <p className="text-sm font-medium text-gray-700 mb-2">📍 Nearby Service Centers</p>}
      <div className="rounded-xl overflow-hidden border mb-5" style={{ height: 320 }}>
        <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={zoomLevel} style={{ height: "100%", width: "100%" }}>
          <RecenterMap lat={mapCenter.lat} lng={mapCenter.lng} zoom={zoomLevel} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {centers.map((sc) => (
            <Marker key={sc.name} position={[sc.lat, sc.lng]}>
              <Popup>{sc.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {city && (
        <div>
          <p className="text-sm text-gray-500 mb-3">{listings.length} listing(s) in {city}</p>
          {listings.map((l) => (
            <div key={l.id} className="border rounded-lg p-3 flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold text-sm">{l.name}</p>
                <p className="text-xs text-gray-400">{l.type} · {l.city}</p>
              </div>
              <p className="font-bold text-blue-600 text-sm">₹{l.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}