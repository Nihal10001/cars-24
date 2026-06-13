"use client";
import { useState } from "react";

export default function Collapsible({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 px-6 text-left text-sm font-semibold uppercase tracking-widest text-gray-600 hover:text-gray-900"
      >
        {title}
        <span className="text-lg">{open ? "∧" : "v"}</span>
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}