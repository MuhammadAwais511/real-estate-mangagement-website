"use client";

import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Property } from "@/data/properties";
import PropertyGallery from "@/components/PropertyGallery";
import { formatPrice, formatDate } from "@/utils/format";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Booking, STORAGE_KEYS } from "@/utils/storage";

// Validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

export default function PropertyDetails({ property }: { property: Property }) {
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    STORAGE_KEYS.favorites,
    []
  );
  const [, setBookings] = useLocalStorage<Booking[]>(
    STORAGE_KEYS.bookings,
    []
  );
  const [, setViewed] = useLocalStorage<string[]>(STORAGE_KEYS.viewed, []);

  // UI State
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

  // Form State
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    note: "",
  });

  // Booking State
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "saving" | "error" | "success"
  >("idle");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    setFieldErrors({});
    setBookingForm({
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      note: "",
    });
  };

  const handleCloseBooking = () => {
    setShowBookingModal(false);
    setBookingStatus("idle");
    setBookingError(null);
    setFieldErrors({});
  };

  const handleFormChange = (field: string, value: string) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!bookingForm.name.trim()) {
      errors.name = "Name is required";
    }

    if (!bookingForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(bookingForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!bookingForm.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!validatePhone(bookingForm.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!bookingForm.date) {
      errors.date = "Please select a date";
    } else {
      const selectedDate = new Date(bookingForm.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.date = "Please select a future date";
      }
    }

    if (!bookingForm.time) {
      errors.time = "Please select a time";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBook = async () => {
    // Validate form
    if (!validateForm()) {
      setBookingError("Please fix the errors below.");
      return;
    }

    const bookingNote = `${bookingForm.name} | ${bookingForm.email} | ${bookingForm.date} | ${bookingForm.time}${bookingForm.note ? ` | Note: ${bookingForm.note}` : ""}`;

    const booking: Booking = {
      id: `booking-${property.id}-${Date.now()}`,
      propertyId: property.id,
      propertyTitle: property.title,
      location: property.location,
      amount: property.price,
      date: formatDate(new Date()),
      phone: bookingForm.phone.trim(),
      note: bookingNote,
    };

    console.log("Sending booking:", booking);

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
        throw new Error(
          data?.error || "Failed to save booking. Please try again."
        );
      }

      // Save locally
      setBookings((prev) => [booking, ...prev]);

      // Reset UI
      setIsConfirmed(true);
      setShowBookingModal(false);
      setBookingStatus("success");
      setBookingForm({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        note: "",
      });
    } catch (error) {
      console.error("Booking error:", error);
      setBookingStatus("error");
      setBookingError(
        error instanceof Error
          ? error.message
          : "Unable to save booking. Please try again later."
      );
    }
  };

  const features = property.features?.slice(0, 4) || [];
  const availabilityLabel = property.available ? "Available now" : "Sold out";

  return (
    <main className="space-y-10 py-10 sm:py-12">
      <section className="space-y-6">
        {/* ── Header ── */}
        <div className="rounded-[36px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">
                Property details
              </p>
              <h1 className="text-4xl font-semibold text-white">
                {property.title}
              </h1>
              <p className="text-slate-400">
                {property.location} • {property.type}
              </p>
            </div>
            <div className="space-y-3 text-right">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                {availabilityLabel}
              </p>
              <p className="text-3xl font-semibold text-cyan-300">
                {formatPrice(property.price)}
              </p>
              <button
                type="button"
                onClick={handleToggleFavorite}
                className="inline-flex items-center justify-center gap-2 rounded-3xl border border-white/10 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-slate-800/90"
              >
                {isFavorite ? (
                  <>
                    <span aria-hidden="true">❤️</span>
                    <span>Remove favorite</span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">🤍</span>
                    <span>Save favorite</span>
                  </>
                )}
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
              <p className="mt-4 text-slate-400 leading-7">
                {property.description}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Bedrooms", value: property.bedrooms },
                  { label: "Bathrooms", value: property.bathrooms },
                  { label: "Area", value: `${property.area} sqft` },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl bg-slate-900/70 p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                      {item.value}
                    </p>
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
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">
                Booking
              </p>
              <div className="mt-4 space-y-4">
                <p className="text-sm text-slate-400">
                  Reserve instantly. Your booking will be saved to the
                  dashboard.
                </p>
                <label className="block text-sm">
                  <span className="text-slate-400">
                    Booking note (optional)
                  </span>
                  <input
                    type="text"
                    value={bookingForm.note}
                    onChange={(e) =>
                      handleFormChange("note", e.target.value)
                    }
                    placeholder="Special request or move-in note"
                    disabled={isConfirmed}
                    className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 disabled:opacity-50"
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
                      : "bg-cyan-400 text-slate-950 hover:bg-cyan-300 active:bg-cyan-500"
                  }`}
                >
                  {!property.available
                    ? "Sold out"
                    : isConfirmed
                    ? "✓ Booked"
                    : "Book a Viewing"}
                </button>
              </div>
            </motion.div>

            {features.length > 0 && (
              <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                  Features
                </p>
                <div className="mt-4 grid gap-3">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="rounded-3xl bg-slate-900/70 px-4 py-3 text-sm text-slate-200"
                    >
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
              <p className="text-lg font-semibold text-cyan-100">
                Booking Confirmed!
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Your viewing for <strong>{property.title}</strong> has been
                saved to your dashboard.
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Our team will contact you shortly to confirm the appointment.
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Booked on {formatDate(new Date())}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex rounded-3xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  View Dashboard →
                </Link>
                <button
                  onClick={() => setIsConfirmed(false)}
                  className="inline-flex rounded-3xl border border-cyan-400/30 px-6 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
                >
                  Book Another Viewing
                </button>
              </div>
            </motion.div>
          )}

          {/* ── Booking Modal ── */}
          {showBookingModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4 py-6 sm:px-6"
              onClick={handleCloseBooking}
            >
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-4xl bg-white p-8 shadow-2xl shadow-slate-950/20"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-semibold text-slate-950">
                      Book a Viewing
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Complete the form and our agent will contact you to
                      confirm the appointment.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseBooking}
                    className="rounded-full bg-slate-100 p-3 text-slate-600 transition hover:bg-slate-200 hover:text-slate-800"
                    aria-label="Close booking form"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={bookingForm.name}
                      onChange={(e) =>
                        handleFormChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      className={`w-full rounded-3xl border ${
                        fieldErrors.name
                          ? "border-red-400"
                          : "border-slate-300"
                      } bg-white px-4 py-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20`}
                    />
                    {fieldErrors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) =>
                        handleFormChange("email", e.target.value)
                      }
                      placeholder="your@email.com"
                      className={`w-full rounded-3xl border ${
                        fieldErrors.email
                          ? "border-red-400"
                          : "border-slate-300"
                      } bg-white px-4 py-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20`}
                    />
                    {fieldErrors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) =>
                        handleFormChange("phone", e.target.value)
                      }
                      placeholder="+92 300 1234567"
                      className={`w-full rounded-3xl border ${
                        fieldErrors.phone
                          ? "border-red-400"
                          : "border-slate-300"
                      } bg-white px-4 py-4 text-slate-900 placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20`}
                    />
                    {fieldErrors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        value={bookingForm.date}
                        onChange={(e) =>
                          handleFormChange("date", e.target.value)
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className={`w-full rounded-3xl border ${
                          fieldErrors.date
                            ? "border-red-400"
                            : "border-slate-300"
                        } bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20`}
                      />
                      {fieldErrors.date && (
                        <p className="mt-1 text-sm text-red-500">
                          {fieldErrors.date}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Preferred Time *
                      </label>
                      <input
                        type="time"
                        value={bookingForm.time}
                        onChange={(e) =>
                          handleFormChange("time", e.target.value)
                        }
                        className={`w-full rounded-3xl border ${
                          fieldErrors.time
                            ? "border-red-400"
                            : "border-slate-300"
                        } bg-white px-4 py-4 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20`}
                      />
                      {fieldErrors.time && (
                        <p className="mt-1 text-sm text-red-500">
                          {fieldErrors.time}
                        </p>
                      )}
                    </div>
                  </div>

                  {bookingError && (
                    <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
                      <p className="text-sm text-red-600">{bookingError}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseBooking}
                      className="flex-1 rounded-3xl border border-slate-300 px-6 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleBook}
                      disabled={
                        !property.available ||
                        bookingStatus === "saving"
                      }
                      className="flex-1 rounded-3xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {bookingStatus === "saving" ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Confirm Booking"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
