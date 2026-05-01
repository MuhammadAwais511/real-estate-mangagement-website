"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to send message.");
      }

      setStatus("success");
      setFeedback("Your message was sent successfully. It will arrive at awaisdeveloper763@gmail.com.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Unable to send message.");
    }
  };

  return (
    <main className="space-y-10 py-10 sm:py-12">
      <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6 rounded-[36px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/25 backdrop-blur-xl">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">Get in touch</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Contact our team.</h1>
            <p className="mt-3 max-w-xl text-slate-400">Send a message directly to our Gmail account, and we’ll get back to you with personalized property support.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block text-slate-400">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
              />
            </label>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block text-slate-400">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
              />
            </label>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block text-slate-400">Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                required
                className="w-full rounded-[28px] border border-white/10 bg-slate-900/70 px-4 py-4 text-white outline-none transition focus:border-cyan-400"
              />
            </label>
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-cyan-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-300/70"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
          </form>

          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-3xl border p-4 text-sm ${
                status === "success"
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                  : "border-rose-400/30 bg-rose-400/10 text-rose-200"
              }`}
            >
              {feedback}
            </motion.div>
          )}
        </div>

        <div className="rounded-[36px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/25 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">Need help fast?</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Schedule a consultation</h2>
          <p className="mt-4 text-slate-400">Our team can help you lock in the right listing, share financing tips, and support your next booking.</p>
          <div className="mt-8 space-y-4 text-sm leading-7 text-slate-400">
            <p><span className="font-semibold text-white">Email:</span> awaisdeveloper763@gmail.com</p>
            <p><span className="font-semibold text-white">Phone:</span> 0336 7359547</p>
            <p><span className="font-semibold text-white">Office:</span> Shah Nawaz Shar Goth C-37</p>
          </div>
        </div>
      </section>
    </main>
  );
}
