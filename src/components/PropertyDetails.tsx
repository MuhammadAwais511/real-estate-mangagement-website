"use client";

import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Property } from "@/data/properties";
import PropertyGallery from "@/components/PropertyGallery";
import { formatPrice, formatDate } from "@/utils/format";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Booking, STORAGE_KEYS } from "@/utils/storage";

export default function PropertyDetails({ property }: { property: Property }) {
  const [favorites, setFavorites] = useLocalStorage<string[]>(STORAGE_KEYS.favorites, []);
  const [, setBookings] = useLocalStorage<Booking[]>(STORAGE_KEYS.bookings, []);
  const [, setViewed] = useLocalStorage<string[]>(STORAGE_KEYS.viewed, []);

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingNote, setBookingNote] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookerName, setBookerName] = useState("");
  const [bookerEmail, setBookerEmail] = useState("");
  const [bookerPhone, setBookerPhone] = useState("");
  const [bookerDate, setBookerDate] = useState("");
  const [bookerTime, setBookerTime] = useState("");
  const [bookingStatus, setBookingStatus] = useState<"idle" | "saving" | "error">("idle");
  const [bookingError, setBookingError] = useState<string | null>(null);

  const isFavorite = favorites.includes(property.id);

  // Track recently viewed
  const updateViewed = useCallback(() => {
    setViewed((prev) => {
      const filtered = prev.filter((id) => id !== property.id);
      return [property.id, ...filtered].slice(0, 8);
    });
  }, [property.id, setViewed]);

  useEffect(() => {
    updateViewed();
  }, [updateViewed]);

  const handleToggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(property.id)
        ? prev.filter((id) => id !== property.id)
        : [...prev, property.id]
    );
  };

  const handleOpenBooking = () => {
    setShowBookingModal(true);
    setBookingStatus("idle");
    setBookingError(null);
  };

  const handleCloseBooking = () => {
    setShowBookingModal(false);
    setBookingStatus("idle");
    setBookingError(null);
  };

  const handleBook = async () => {
  // ✅ basic validation (extra safety)
  if (!bookerName || !bookerEmail || !bookerPhone || !bookerDate || !bookerTime) {
    setBookingError("Please fill all required fields.");
    return;
  }

  const booking: Booking = {
    id: `booking-${property.id}-${Date.now()}`,
    propertyId: property.id,
    propertyTitle: property.title,
    location: property.location,
    amount: property.price,
    date: formatDate(new Date()),

    // ✅ CRITICAL FIX (phone now included)
    phone: bookerPhone.trim(),

    // ❌ remove phone from note (clean structure)
    note: `${bookerName} | ${bookerEmail} | ${bookerDate} | ${bookerTime}${
      bookingNote ? ` | ${bookingNote}` : ""
    }`,
  };

  console.log("📤 Sending booking:", booking); // debug

  setBookingStatus("saving");
  setBookingError(null);

  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Booking failed");
    }

    // ✅ save locally
    setBookings((prev) => [booking, ...prev]);

    // ✅ reset UI
    setIsConfirmed(true);
    setBookingNote("");
    setBookerName("");
    setBookerEmail("");
    setBookerPhone("");
    setBookerDate("");
    setBookerTime("");
    setShowBookingModal(false);
    setBookingStatus("idle");

  } catch (error) {
    console.error("❌ Booking error:", error);

    setBookingStatus("error");
    setBookingError(
      error instanceof Error
        ? error.message
        : "Unable to save booking. Try again."
    );
  }
};

  const features = property.features.slice(0, 4);
  const availabilityLabel = property.available ? "Available now" : "Sold out";

  return (
    <main className="space-y-10 py-10 sm:py-12">
      <section className="space-y-6">

        {/* ── Header ── */}
        <div className="rounded-[36px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">Property details</p>
              <h1 className="text-4xl font-semibold text-white">{property.title}</h1>
              <p className="text-slate-400">{property.location} • {property.type}</p>
            </div>
            <div className="space-y-3 text-right">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">{availabilityLabel}</p>
              <p className="text-3xl font-semibold text-cyan-300">{formatPrice(property.price)}</p>
              <button
                type="button"
                onClick={handleToggleFavorite}
                className="inline-flex items-center justify-center rounded-3xl border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-slate-800/90"
              >
                {isFavorite ? "❤️ Remove favorite" : "🤍 Save favorite"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">

          {/* Left */}
          <div className="space-y-6">
            {property.images && property.images.length > 0 && (
              <PropertyGallery images={property.images} />
            )}
            <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
              <h2 className="text-2xl font-semibold text-white">Overview</h2>
              <p className="mt-4 text-slate-400 leading-7">{property.description}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Bedrooms", value: property.bedrooms },
                  { label: "Bathrooms", value: property.bathrooms },
                  { label: "Area", value: `${property.area} sqft` },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl bg-slate-900/70 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">Booking</p>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-slate-400">
                  Reserve instantly. Your booking will be saved to the dashboard.
                </p>
                <label className="block text-sm">
                  <span className="text-slate-400">Booking note (optional)</span>
                  <input
                    type="text"
                    value={bookingNote}
                    onChange={(e) => setBookingNote(e.target.value)}
                    placeholder="Special request or move-in note"
                    disabled={isConfirmed}
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400 disabled:opacity-50"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleOpenBooking}
                  disabled={!property.available || isConfirmed}
                  className={`inline-flex w-full items-center justify-center rounded-3xl px-6 py-4 text-sm font-semibold transition ${
                    !property.available
                      ? "cursor-not-allowed bg-slate-700 text-slate-400"
                      : isConfirmed
                      ? "cursor-not-allowed bg-emerald-500/20 text-emerald-300"
                      : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                  }`}
                >
                  {!property.available ? "Sold out" : isConfirmed ? "✓ Booked" : "Book a viewing"}
                </button>
              </div>
            </motion.div>

            {features.length > 0 && (
              <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Features</p>
                <div className="mt-4 grid gap-3">
                  {features.map((feature) => (
                    <div key={feature} className="rounded-3xl bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* ── Booking confirmation banner ── */}
        <AnimatePresence>
          {isConfirmed && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-4xl border border-cyan-300/20 bg-cyan-300/10 p-6 text-slate-100 shadow-inner shadow-cyan-300/10"
            >
              <p className="text-lg font-semibold text-cyan-100">✓ Booking confirmed!</p>
              <p className="mt-2 text-sm text-slate-200">
                <strong>{property.title}</strong> ka booking dashboard mein save ho gaya hai.
              </p>
              <p className="mt-2 text-sm text-slate-200">
                We have received your details. Our Team will contact you soon.
              </p>
              <p className="mt-1 text-sm text-slate-400">Booked on {formatDate(new Date())}</p>
              <Link
                href="/dashboard"
                className="mt-4 inline-flex rounded-3xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Dashboard mein dekho →
              </Link>
            </motion.div>
          )}

          {showBookingModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4 py-6 sm:px-6"
              onClick={handleCloseBooking}
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl rounded-4xl bg-slate-100 p-8 shadow-2xl shadow-slate-950/20"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold text-slate-950">Book a Viewing</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Complete the form and our agent will contact you to confirm the appointment.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseBooking}
                    className="rounded-full bg-slate-200 p-3 text-slate-600 transition hover:bg-slate-300"
                    aria-label="Close booking form"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-8 space-y-4">
                  <input
                    type="text"
                    value={bookerName}
                    onChange={(e) => setBookerName(e.target.value)}
                    placeholder="Name"
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-cyan-400"
                  />
                  <input
                    type="email"
                    value={bookerEmail}
                    onChange={(e) => setBookerEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-cyan-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={bookerPhone}
                    onChange={(e) => setBookerPhone(e.target.value)}
                    placeholder="Phone"
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-cyan-400"
                  />
                  <input
                    type="date"
                    value={bookerDate}
                    onChange={(e) => setBookerDate(e.target.value)}
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-cyan-400"
                  />
                  <input
                    type="time"
                    value={bookerTime}
                    onChange={(e) => setBookerTime(e.target.value)}
                    className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-cyan-400"
                  />
                  {bookingError && (
                    <p className="text-sm text-rose-500">{bookingError}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleBook}
                    disabled={
                      !bookerName || !bookerEmail || !bookerPhone || !bookerDate || !bookerTime || !property.available || bookingStatus === "saving"
                    }
                    className="mt-4 inline-flex w-full items-center justify-center rounded-3xl bg-red-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {bookingStatus === "saving" ? "Sending..." : "SEND"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>
    </main>
  );
}
