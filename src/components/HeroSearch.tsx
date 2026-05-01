"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const propertyTypes = ["All", "Apartment", "House", "Office", "Villa", "Studio"];

export default function HeroSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("All");
  const [price, setPrice] = useState("Any");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (type !== "All") params.set("type", type);
    if (price !== "Any") params.set("price", price);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section id="home" className="overflow-hidden rounded-[36px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-12">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <div className="space-y-6 text-center sm:text-left">
          <p className="inline-flex rounded-full bg-cyan-400/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.26em] text-cyan-300">
            Pakistani properties.
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Discover premium homes and offices across Pakistan.
          </h1>
          <p className="mx-auto max-w-2xl text-slate-400 sm:mx-0">
            Search Lahore, Karachi, Islamabad and more for modern flats, villas, and office spaces with live booking support.
          </p>
        </div>

        <div className="mt-10 rounded-4xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/20 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-300">
              <span>Location</span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Lahore, Karachi, Islamabad..."
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Type</span>
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                {propertyTypes.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Budget</span>
              <select
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              >
                <option>Any</option>
                <option value="0-1000000">Below PKR 1,000,000</option>
                <option value="1000000-2500000">PKR 1,000,000–2,500,000</option>
                <option value="2500000-9999999">Above PKR 2,500,000</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 sm:w-auto"
          >
            Search properties
          </button>
        </div>
      </motion.div>
    </section>
  );
}
