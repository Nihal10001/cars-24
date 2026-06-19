"use client";
import dynamic from "next/dynamic";

const GeoFenceMap = dynamic(() => import("./GeoFenceMap"), {
  ssr: false,
  loading: () => <p className="text-center py-10 text-gray-400">Loading map…</p>,
});

export default function GeoFence() {
  return <GeoFenceMap />;
}