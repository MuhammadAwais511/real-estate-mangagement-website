"use client";

import { useEffect, useMemo, useState } from "react";
import FiltersPanel, { Filters } from "@/components/FiltersPanel";
import PropertyCard from "@/components/PropertyCard";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";
import { properties as propertyList } from "@/data/properties";
import { Property } from "@/data/properties";

export default function PropertiesPage() {
  const [filters, setFilters] = useState<Filters>({
    location: "",
    type: "All",
    minPrice: "",
    maxPrice: "",
    sort: "low-high",
  });
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 600);
    return () => window.clearTimeout(timeout);
  }, []);

  const filteredProperties = useMemo(() => {
    const minPriceValue = Number(filters.minPrice) || 0;
    const maxPriceValue = Number(filters.maxPrice) || Number.POSITIVE_INFINITY;

    return propertyList
      .filter((property) => {
        const matchesLocation = filters.location
          ? property.location.toLowerCase().includes(filters.location.toLowerCase())
          : true;
        const matchesType = filters.type === "All" ? true : property.type === filters.type;
        const matchesMinPrice = property.price >= minPriceValue;
        const matchesMaxPrice = property.price <= maxPriceValue;
        return matchesLocation && matchesType && matchesMinPrice && matchesMaxPrice;
      })
      .sort((a, b) => {
        if (filters.sort === "high-low") {
          return b.price - a.price;
        }
        return a.price - b.price;
      });
  }, [filters]);

  function handleToggleFavorite(id: string) {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  return (
    <main className="space-y-10 py-10 sm:py-12">
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Search & filter</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Find your next property</h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-400">
            Refine your search by type, location, budget, and sort order for the perfect property match.
          </p>
        </div>

        <FiltersPanel filters={filters} onChange={setFilters} />
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400/90">
            {filteredProperties.length} listings available
          </p>
          <p className="text-sm text-slate-500">Quickly preview, favorite, or explore property details.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)
            : filteredProperties.length > 0
            ? filteredProperties.map((property: Property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={favoriteIds.includes(property.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            : <EmptyState title="No matches found" description="Try adjusting your filters or search terms to discover more properties." />}
        </div>
      </section>
    </main>
  );
}
