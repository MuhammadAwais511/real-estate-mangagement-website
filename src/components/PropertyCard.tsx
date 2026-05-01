"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Property } from "@/data/properties";
import { formatPrice } from "@/utils/format";

export default function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
}: {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}) {
  const router = useRouter();

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(property.id);
  };

  const handleViewDetails = () => {
    // ✅ Removed encodeURIComponent — IDs are plain slugs, no encoding needed
    router.push(`/properties/${property.id}`);
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-4xl border border-white/10 bg-slate-950/80 shadow-2xl transition cursor-pointer"
      onClick={handleViewDetails}
    >
      <div className="relative h-72 overflow-hidden">
        {property.images?.[0] ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <span className="text-slate-400">No image</span>
          </div>
        )}

        <div className="absolute inset-x-0 top-5 flex justify-between px-5">
          <span className="bg-slate-950/80 px-4 py-2 text-xs text-cyan-300 rounded-3xl">
            {property.type}
          </span>

          <button
            onClick={handleFavoriteClick}
            className="bg-slate-950/80 p-3 rounded-full z-10"
          >
            {isFavorite ? "♥" : "♡"}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between">
          <div>
            <h3 className="text-white text-xl">{property.title}</h3>
            <p className="text-slate-400 text-sm">{property.location}</p>
          </div>
          <p className="text-cyan-300 font-semibold">
            {formatPrice(property.price)}
          </p>
        </div>

        <div className="grid grid-cols-3 text-sm text-slate-400">
          <span>{property.bedrooms} Beds</span>
          <span>{property.bathrooms} Baths</span>
          <span>{property.area} sqft</span>
        </div>

        <div className="w-full text-center rounded-3xl bg-white/10 py-3 text-white">
          View details
        </div>
      </div>
    </motion.article>
  );
}
