export type Booking = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  location: string;
  amount: number;
  date: string;
  phone: string;
  note?: string;
};

export const STORAGE_KEYS = {
  favorites: "reside:favorites",
  bookings:  "reside:bookings",
  viewed:    "reside:viewed",
} as const;
