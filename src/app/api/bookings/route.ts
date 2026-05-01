import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { Booking } from "@/utils/storage";

const BOOKINGS_FILE = path.join(process.cwd(), "bookings.json");

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || "Bookings";

const AIRTABLE_API_URL =
  AIRTABLE_BASE_ID && AIRTABLE_TABLE_NAME
    ? `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(
        AIRTABLE_TABLE_NAME
      )}`
    : "";

// ✅ Airtable Save Function (FIXED)
async function saveToAirtable(booking: Booking) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error("Airtable environment variables missing");
  }

  const response = await fetch(AIRTABLE_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [
        {
         fields: {
  "Booking ID": booking.id,
  "Property ID": booking.propertyId,
  "Property Title": booking.propertyTitle,
  Location: booking.location,
  Amount: booking.amount,
  Date: booking.date,
 "Phone Number": String(booking.phone || "NO_PHONE"), // ✅ THIS LINE ADD
  Note: booking.note || "",
}
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Airtable Error Response:", data);
    throw new Error(
      data?.error?.message || "Failed to save record to Airtable"
    );
  }

  return data;
}


// ✅ POST API
export async function POST(request: Request) {
  try {
    const booking = (await request.json()) as Booking;

    if (!booking || typeof booking !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid booking payload." },
        { status: 400 }
      );
    }

    // ===============================
    // 🔹 SAVE TO AIRTABLE
    // ===============================
    let airtableSaved = false;

    try {
      await saveToAirtable(booking);
      airtableSaved = true;
    } catch (error) {
      console.error("❌ Airtable save failed:", error);

      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Airtable save failed",
        },
        { status: 500 }
      );
    }

    // ===============================
    // 🔹 SAVE TO LOCAL FILE (fallback)
    // ===============================
    try {
      let bookings: Booking[] = [];

      try {
        const fileContent = await fs.readFile(BOOKINGS_FILE, "utf8");

        bookings =
          fileContent.trim() === ""
            ? []
            : (JSON.parse(fileContent) as Booking[]);

        if (!Array.isArray(bookings)) {
          bookings = [];
        }
      } catch (error: any) {
        if (error.code === "ENOENT") {
          bookings = [];
        } else {
          console.warn(
            "⚠️ Error reading bookings.json, resetting file:",
            error
          );
          bookings = [];
        }
      }

      bookings.unshift(booking);

      await fs.writeFile(
        BOOKINGS_FILE,
        JSON.stringify(bookings, null, 2) + "\n",
        "utf8"
      );
    } catch (error) {
      console.warn("⚠️ File save failed:", error);

      if (!airtableSaved) {
        return NextResponse.json(
          {
            success: false,
            error: "Failed to save booking anywhere",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: true, booking },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Booking API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}