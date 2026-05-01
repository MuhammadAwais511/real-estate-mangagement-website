"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { formatDate, formatPrice } from "@/utils/format";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Booking, STORAGE_KEYS } from "@/utils/storage";

// ─── Tab type ────────────────────────────────────────────────────────────────
type Tab = "bookings" | "favorites";

export default function DashboardPage() {
  const [bookings, setBookings] = useLocalStorage<Booking[]>(STORAGE_KEYS.bookings, []);
  const [favorites, setFavorites] = useLocalStorage<string[]>(STORAGE_KEYS.favorites, []);

  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "price-high" | "price-low">("newest");

  // ── Derived data ────────────────────────────────────────────────────────────
  const favoriteProperties = useMemo(
    () => properties.filter((p) => favorites.includes(p.id)),
    [favorites]
  );

  const filteredAndSortedBookings = useMemo(() => {
    let result = [...bookings];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.propertyTitle.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q) ||
          (b.note ?? "").toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortOrder === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortOrder === "price-high") return b.amount - a.amount;
      if (sortOrder === "price-low") return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [bookings, searchQuery, sortOrder]);

  const totalSpend = useMemo(
    () => bookings.reduce((sum, b) => sum + b.amount, 0),
    [bookings]
  );

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleDeleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setDeleteConfirmId(null);
    if (editingId === id) setEditingId(null);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingId(booking.id);
    setNoteDraft(booking.note ?? "");
  };

  const handleSaveNote = () => {
    if (!editingId) return;
    setBookings((prev) =>
      prev.map((b) => (b.id === editingId ? { ...b, note: noteDraft } : b))
    );
    setEditingId(null);
    setNoteDraft("");
  };

  const handleClearAllBookings = () => {
    setBookings([]);
    setDeleteConfirmId(null);
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((fid) => fid !== id));
  };

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <main className="space-y-10 py-10 sm:py-12">

      {/* ── Page header ── */}
      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Your dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Bookings & saved homes</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Manage your reservations, add notes, and keep favourites within easy reach.
        </p>
      </section>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total bookings", value: bookings.length },
          { label: "Total spend", value: formatPrice(totalSpend) },
          { label: "Favourites", value: favoriteProperties.length },
          { label: "Properties", value: properties.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5 shadow-xl"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-2 rounded-3xl border border-white/10 bg-slate-950/80 p-1.5 w-fit">
        {(["bookings", "favorites"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-3xl px-6 py-2.5 text-sm font-semibold transition ${
              activeTab === tab
                ? "bg-cyan-400 text-slate-950"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab === "bookings" ? `Bookings (${bookings.length})` : `Favourites (${favoriteProperties.length})`}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════
          BOOKINGS TAB
      ═══════════════════════════════════════════════════ */}
      {activeTab === "bookings" && (
        <section className="space-y-6">

          {bookings.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookings…"
                className="rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 sm:w-72"
              />
              <div className="flex flex-wrap gap-3">
                {/* Sort */}
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                  className="rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="price-high">Price: high → low</option>
                  <option value="price-low">Price: low → high</option>
                </select>
                {/* Clear all */}
                {deleteConfirmId === "all" ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleClearAllBookings}
                      className="rounded-3xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
                    >
                      Confirm clear all
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="rounded-3xl bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId("all")}
                    className="rounded-3xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300 transition hover:bg-rose-500/20"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}

          {filteredAndSortedBookings.length === 0 ? (
            <EmptyBookings hasBookings={bookings.length > 0} />
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {filteredAndSortedBookings.map((booking, i) => {
                  const property = properties.find((p) => p.id === booking.propertyId);
                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.03 }}
                      className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-xl"
                    >
                      {/* Booking header */}
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3 flex-wrap">
                            <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/90">
                              {booking.propertyTitle}
                            </p>
                            {property?.type && (
                              <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs text-slate-400">
                                {property.type}
                              </span>
                            )}
                          </div>
                          <p className="text-white">{booking.location}</p>
                          <p className="text-sm text-slate-500">
                            Booked on {formatDate(booking.createdAt)}
                          </p>
                          {booking.note && editingId !== booking.id && (
                            <p className="mt-2 rounded-2xl bg-slate-900/60 px-4 py-2 text-sm text-slate-300 italic">
                              &quot;{booking.note}&quot;
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="shrink-0 text-right space-y-1">
                          <p className="text-2xl font-semibold text-cyan-300">
                            {formatPrice(booking.amount)}
                          </p>
                          <p className="text-xs text-slate-500">{booking.date}</p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            editingId === booking.id
                              ? setEditingId(null)
                              : handleEditBooking(booking)
                          }
                          className="rounded-3xl bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
                        >
                          {editingId === booking.id ? "Cancel edit" : "Edit note"}
                        </button>

                        {property && (
                          <Link
                            href={`/properties/${property.id}`}
                            className="rounded-3xl bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
                          >
                            View property
                          </Link>
                        )}

                        {deleteConfirmId === booking.id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="rounded-3xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
                            >
                              Confirm delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="rounded-3xl bg-white/10 px-4 py-2 text-sm text-white"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(booking.id)}
                            className="rounded-3xl bg-rose-500/10 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-500/20"
                          >
                            Delete
                          </button>
                        )}
                      </div>

                      {/* Inline note editor */}
                      <AnimatePresence>
                        {editingId === booking.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-5 space-y-3 rounded-3xl border border-cyan-300/10 bg-slate-900/70 p-4">
                              <label className="block text-sm text-slate-300">
                                <span className="text-slate-400">Update booking note</span>
                                <input
                                  value={noteDraft}
                                  onChange={(e) => setNoteDraft(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && handleSaveNote()}
                                  placeholder="Add a reminder or move-in note"
                                  autoFocus
                                  className="mt-3 w-full rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                                />
                              </label>
                              <div className="flex gap-3">
                                <button
                                  type="button"
                                  onClick={handleSaveNote}
                                  className="rounded-3xl bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                                >
                                  Save note
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="rounded-3xl bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          FAVORITES TAB
      ═══════════════════════════════════════════════════ */}
      {activeTab === "favorites" && (
        <section className="space-y-6">
          {favoriteProperties.length === 0 ? (
            <div className="rounded-[36px] border border-white/10 bg-slate-950/80 p-12 text-center shadow-xl">
              <p className="text-2xl text-white">No favourites yet</p>
              <p className="mt-3 text-slate-400">
                Tap the heart icon on any property listing or detail page to save it here.
              </p>
              <Link
                href="/properties"
                className="mt-6 inline-flex rounded-3xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Browse properties
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence>
                {favoriteProperties.map((property, i) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                  >
                    <PropertyCard
                      property={property}
                      isFavorite
                      onToggleFavorite={handleRemoveFavorite}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

// ─── Empty state component ────────────────────────────────────────────────────
function EmptyBookings({ hasBookings }: { hasBookings: boolean }) {
  return (
    <div className="rounded-[36px] border border-white/10 bg-slate-950/80 p-12 text-center shadow-xl">
      <p className="text-2xl text-white">
        {hasBookings ? "No results found" : "No bookings yet"}
      </p>
      <p className="mt-3 text-slate-400">
        {hasBookings
          ? "Try a different search term."
          : 'Go to a property page and click "Book now" to make a reservation.'}
      </p>
      {!hasBookings && (
        <Link
          href="/properties"
          className="mt-6 inline-flex rounded-3xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Browse properties
        </Link>
      )}
    </div>
  );
}
