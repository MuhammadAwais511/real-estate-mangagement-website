import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

type ContactData = {
  name: string;
  email: string;
  message: string;
};

const RECEIVER_EMAIL = "awaisdeveloper763@gmail.com";

function validateContactData(data: ContactData) {
  return (
    typeof data.name === "string" && data.name.trim().length > 0 &&
    typeof data.email === "string" && data.email.trim().length > 0 &&
    typeof data.message === "string" && data.message.trim().length > 0
  );
}

function createTransporter() {
  const user = process.env.GMAIL_SMTP_USER;
  const pass = process.env.GMAIL_SMTP_PASS;
  const host = process.env.GMAIL_SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.GMAIL_SMTP_PORT ?? 465);
  const secure = process.env.GMAIL_SMTP_SECURE !== "false";

  if (!user || !pass) {
    throw new Error("Missing Gmail SMTP credentials. Set GMAIL_SMTP_USER and GMAIL_SMTP_PASS.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as ContactData;

    if (!validateContactData(data)) {
      return NextResponse.json(
        { error: "Please provide name, email, and message." },
        { status: 400 }
      );
    }

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `${data.name} <${data.email}>`,
      to: RECEIVER_EMAIL,
      subject: `New contact message from ${data.name}`,
      text: `You received a new message from ${data.name} (${data.email}):\n\n${data.message}`,
      html: `<p><strong>Name:</strong> ${data.name}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Message:</strong></p><p>${data.message.replace(/\n/g, "<br />")}</p>`,
    });

    return NextResponse.json({ success: true, message: "Email sent." }, { status: 200 });
  } catch (error) {
    console.error("Contact email error:", error);
    const message = error instanceof Error ? error.message : "Unable to send contact message at this time.";
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "production"
            ? "Unable to send contact message at this time."
            : message,
      },
      { status: 500 }
    );
  }
}
