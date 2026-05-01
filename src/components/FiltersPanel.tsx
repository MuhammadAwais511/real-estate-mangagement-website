"use client";

export type Filters = {
  type: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
};

export default function FiltersPanel({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  return (
    <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="grid gap-4 lg:grid-cols-5">
        <label className="space-y-2 text-sm text-slate-300">
          <span>Location</span>
          <input
            value={filters.location}
            onChange={(event) => onChange({ ...filters, location: event.target.value })}
            placeholder="All cities"
            className="w-full rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Type</span>
          <select
            value={filters.type}
            onChange={(event) => onChange({ ...filters, type: event.target.value })}
            className="w-full rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          >
            <option value="All">All</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Office">Office</option>
            <option value="Villa">Villa</option>
            <option value="Studio">Studio</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Min Price</span>
          <input
            value={filters.minPrice}
            onChange={(event) => onChange({ ...filters, minPrice: event.target.value })}
            placeholder="0"
            className="w-full rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Max Price</span>
          <input
            value={filters.maxPrice}
            onChange={(event) => onChange({ ...filters, maxPrice: event.target.value })}
            placeholder="Any"
            className="w-full rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Sort</span>
          <select
            value={filters.sort}
            onChange={(event) => onChange({ ...filters, sort: event.target.value })}
            className="w-full rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          >
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </label>
      </div>
    </div>
  );
}
