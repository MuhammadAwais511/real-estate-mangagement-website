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
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    STORAGE_KEYS.favorites,
    []
  );

  const [, setBookings] = useLocalStorage<Booking[]>(
    STORAGE_KEYS.bookings,
    []
  );

  const [, setViewed] = useLocalStorage<string[]>(
    STORAGE_KEYS.viewed,
    []
  );

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingNote, setBookingNote] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [bookerName, setBookerName] = useState("");
  const [bookerEmail, setBookerEmail] = useState("");
  const [bookerPhone, setBookerPhone] = useState("");
  const [bookerDate, setBookerDate] = useState("");
  const [bookerTime, setBookerTime] = useState("");

  const [bookingStatus, setBookingStatus] =
    useState<"idle" | "saving" | "error">("idle");

  const [bookingError, setBookingError] = useState<string | null>(null);

  const isFavorite = favorites.includes(property.id);

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
    // validation
    if (
      !bookerName ||
      !bookerEmail ||
      !bookerPhone ||
      !bookerDate ||
      !bookerTime
    ) {
      setBookingError("Please fill all required fields.");
      return;
    }

    // ✅ FIXED BOOKING OBJECT
    const booking: Booking = {
      id: `booking-${property.id}-${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      location: property.location,
      amount: property.price,
      date: formatDate(new Date()),
      phone: bookerPhone.trim(),

      // 🔥 IMPORTANT FIX
      createdAt: new Date().toISOString(),

      note: `${bookerName} | ${bookerEmail} | ${bookerDate} | ${bookerTime}${
        bookingNote ? ` | ${bookingNote}` : ""
      }`,
    };

    console.log("📤 Sending booking:", booking);

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

      // save locally
      setBookings((prev) => [booking, ...prev]);

      // reset UI
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
  const availabilityLabel = property.available
    ? "Available now"
    : "Sold out";

  return (
    <main className="space-y-10 py-10 sm:py-12">
      <section className="space-y-6">

        {/* Header */}
        <div className="rounded-[36px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-semibold text-white">
                {property.title}
              </h1>
              <p className="text-slate-400">
                {property.location} • {property.type}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-400">{availabilityLabel}</p>
              <p className="text-3xl text-cyan-300 font-semibold">
                {formatPrice(property.price)}
              </p>

              <button
                onClick={handleToggleFavorite}
                className="mt-3 rounded-3xl border px-4 py-2 text-white"
              >
                {isFavorite ? "❤️ Remove" : "🤍 Save"}
              </button>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <AnimatePresence>
          {showBookingModal && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex items-center justify-center"
              onClick={handleCloseBooking}
            >
              <motion.div
                className="bg-white p-6 rounded-2xl w-[90%] max-w-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold">Book Property</h2>

                <input
                  placeholder="Name"
                  value={bookerName}
                  onChange={(e) => setBookerName(e.target.value)}
                  className="w-full border p-2 mt-3"
                />

                <input
                  placeholder="Email"
                  value={bookerEmail}
                  onChange={(e) => setBookerEmail(e.target.value)}
                  className="w-full border p-2 mt-2"
                />

                <input
                  placeholder="Phone"
                  value={bookerPhone}
                  onChange={(e) => setBookerPhone(e.target.value)}
                  className="w-full border p-2 mt-2"
                />

                <input
                  type="date"
                  value={bookerDate}
                  onChange={(e) => setBookerDate(e.target.value)}
                  className="w-full border p-2 mt-2"
                />

                <input
                  type="time"
                  value={bookerTime}
                  onChange={(e) => setBookerTime(e.target.value)}
                  className="w-full border p-2 mt-2"
                />

                {bookingError && (
                  <p className="text-red-500 text-sm mt-2">
                    {bookingError}
                  </p>
                )}

                <button
                  onClick={handleBook}
                  className="w-full bg-cyan-500 text-white p-3 mt-4 rounded-xl"
                >
                  {bookingStatus === "saving"
                    ? "Saving..."
                    : "Confirm Booking"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </section>
    </main>
  );
}
