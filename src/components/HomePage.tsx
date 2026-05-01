"use client";

import { motion } from "framer-motion";
import HeroSearch from "@/components/HeroSearch";
import SectionHeading from "@/components/SectionHeading";
import CategoryCard from "@/components/CategoryCard";
import PropertyCard from "@/components/PropertyCard";
import TestimonialCard from "@/components/TestimonialCard";
import { featuredProperties } from "@/data/properties";
import { testimonials } from "@/data/testimonials";
import { useState } from "react";

const categories = [
  { title: "Apartments", subtitle: "City living with style", accent: "bg-cyan-400/10 text-cyan-300" },
  { title: "Houses", subtitle: "Family-friendly retreats", accent: "bg-violet-400/10 text-violet-300" },
  { title: "Offices", subtitle: "Professional space solutions", accent: "bg-amber-300/10 text-amber-200" },
];

export default function HomePage() {
  const [favoriteProperties, setFavoriteProperties] = useState<string[]>([]);

  return (
    <main className="space-y-20 py-10 sm:py-12">
      <HeroSearch />

      <section className="space-y-10">
        <SectionHeading
          title="Featured listings crafted for modern buyers"
          description="Browse the latest premium homes, studios, and office spaces curated for a seamless property experience."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={favoriteProperties.includes(property.id)}
              onToggleFavorite={(id) => {
                setFavoriteProperties((current) =>
                  current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
                );
              }}
            />
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          title="Explore by category"
          description="Everything from urban apartments to flexible offices — find your style and browse the latest property types."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <SectionHeading
          title="Trusted by modern home seekers"
          description="Read what clients are saying about the premium experience, intuitive booking flow, and quality listings."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[36px] border border-white/10 bg-linear-to-r from-cyan-400/10 via-slate-900/80 to-violet-400/10 p-10 text-center shadow-2xl shadow-cyan-500/10"
      >
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">Ready to take the next step?</p>
        <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Start your booking journey with a curated property tour.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">Save favorites, review recently viewed homes, and manage your booking history from one premium dashboard.</p>
      </motion.section>
    </main>
  );
}
