"use client";

import { useCallback, useMemo, useState } from "react";

type Attendance = "yes" | "no" | "";

interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: number; // epoch ms
}

const NAME_MAX = 40;
const MESSAGE_MAX = 300;

// Seed data. GANTI/hapus setelah backend RSVP tersedia.
const INITIAL_WISHES: Wish[] = [
  {
    id: "seed-1",
    name: "R",
    message:
      "Congrats buat pasangan baru semoga semuanya berjalan dengan lancar!",
    createdAt: Date.now() - (92 * 86400000 + 2 * 3600000),
  },
  {
    id: "seed-2",
    name: "Nayla",
    message: "Happy Wedding",
    createdAt: Date.now() - (140 * 86400000 + 1 * 3600000),
  },
  {
    id: "seed-3",
    name: "Lauren",
    message: "Congrats!",
    createdAt: Date.now() - (217 * 86400000 + 19 * 3600000),
  },
  {
    id: "seed-4",
    name: "Chelsea",
    message: "Happy wedding \u2764\ufe0f",
    createdAt: Date.now() - 240 * 86400000,
  },
];

function formatRelativeTime(timestamp: number): string {
  const diffMs = Math.max(Date.now() - timestamp, 0);
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);

  if (days === 0 && hours === 0) return "Just now";
  if (days === 0) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export default function RsvpWishes() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("");
  const [wishes, setWishes] = useState<Wish[]>(INITIAL_WISHES);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const trimmedName = name.trim();
  const trimmedMessage = message.trim();

  const canSubmit = useMemo(
    () =>
      trimmedName.length > 0 &&
      trimmedMessage.length > 0 &&
      attendance !== "" &&
      !submitting,
    [trimmedName, trimmedMessage, attendance, submitting],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!trimmedName || !trimmedMessage || !attendance) {
        setError("Please fill in your name, message, and attendance.");
        return;
      }

      setSubmitting(true);
      setError(null);

      try {
        // TODO: ganti dengan panggilan API nyata, contoh:
        // const res = await fetch("/api/rsvp", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ name: trimmedName, message: trimmedMessage, attendance }),
        // });
        // if (!res.ok) throw new Error("Failed to submit RSVP");
        //
        // State di bawah ini hanya optimistic local update —
        // BELUM persist ke server / sinkron antar pengunjung.
        const newWish: Wish = {
          id: createId(),
          name: trimmedName.slice(0, NAME_MAX),
          message: trimmedMessage.slice(0, MESSAGE_MAX),
          createdAt: Date.now(),
        };

        setWishes((prev) => [newWish, ...prev]);
        setName("");
        setMessage("");
        setAttendance("");
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [trimmedName, trimmedMessage, attendance],
  );

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden [container-type:inline-size]">
      <div className="pointer-events-auto relative z-10 flex h-full flex-col px-[6cqw] pt-[8%] pb-[4%]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex shrink-0 flex-col gap-[3cqw] md:gap-3"
        >
          <label className="sr-only" htmlFor="rsvp-name">
            Name
          </label>
          <input
            id="rsvp-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            maxLength={NAME_MAX}
            autoComplete="name"
            disabled={submitting}
            className="w-full rounded-lg border border-[#2a2a2a]/20 bg-white px-[4cqw] py-[3cqw] text-[3.4cqw] text-[#2a2a2a] shadow-sm outline-none transition-shadow placeholder:text-[#2a2a2a]/50 focus:ring-2 focus:ring-[#7a5c48]/40 disabled:opacity-60 md:px-4 md:py-2.5 md:text-sm"
          />

          <label className="sr-only" htmlFor="rsvp-message">
            Leave a Message
          </label>
          <textarea
            id="rsvp-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a Message"
            rows={3}
            maxLength={MESSAGE_MAX}
            disabled={submitting}
            className="w-full resize-none rounded-lg border border-[#2a2a2a]/20 bg-white px-[4cqw] py-[3cqw] text-[3.4cqw] text-[#2a2a2a] shadow-sm outline-none transition-shadow placeholder:text-[#2a2a2a]/50 focus:ring-2 focus:ring-[#7a5c48]/40 disabled:opacity-60 md:px-4 md:py-2.5 md:text-sm"
          />

          <label className="sr-only" htmlFor="rsvp-attendance">
            Confirm Attendance
          </label>
          <div className="relative">
            <select
              id="rsvp-attendance"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value as Attendance)}
              disabled={submitting}
              className="w-full appearance-none rounded-lg border border-[#2a2a2a]/20 bg-white px-[4cqw] py-[3cqw] text-[3.4cqw] text-[#2a2a2a] shadow-sm outline-none transition-shadow focus:ring-2 focus:ring-[#7a5c48]/40 disabled:opacity-60 md:px-4 md:py-2.5 md:text-sm"
            >
              <option value="" disabled>
                Confirm Attendance
              </option>
              <option value="yes">Yes, I will attend</option>
              <option value="no">Sorry, can&apos;t make it</option>
            </select>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="pointer-events-none absolute right-[4cqw] top-1/2 h-[4cqw] w-[4cqw] -translate-y-1/2 fill-[#2a2a2a]/70 md:right-4 md:h-4 md:w-4"
            >
              <path d="M5 7l5 6 5-6H5z" />
            </svg>
          </div>

          {error && (
            <p role="alert" className="text-[2.8cqw] text-red-600 md:text-xs">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-[1%] w-full rounded-full bg-[#7a5c48] py-[3.2cqw] text-[3.4cqw] font-bold uppercase tracking-wide text-white shadow-md transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 md:py-3 md:text-sm"
          >
            {submitting ? "Sending..." : "Submit"}
          </button>
        </form>

        <div className="mt-[4%] min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-xl border border-[#2a2a2a]/15 bg-white/95 px-[4cqw] py-[2cqw] shadow-sm md:px-5 md:py-3">
          {wishes.length === 0 ? (
            <p className="py-[6cqw] text-center text-[3cqw] text-[#2a2a2a]/50 md:py-8 md:text-sm">
              Be the first to leave a wish!
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-[#2a2a2a]/10">
              {wishes.map((wish) => (
                <li
                  key={wish.id}
                  className="flex gap-[3cqw] py-[3cqw] md:gap-3 md:py-3"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-[8cqw] w-[8cqw] shrink-0 items-center justify-center rounded-full bg-[#7a5c48]/10 text-[3.2cqw] font-semibold text-[#7a5c48] md:h-9 md:w-9 md:text-sm"
                  >
                    {getInitial(wish.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[3.6cqw] font-bold text-[#5a3d2b] md:text-base">
                      {wish.name}
                    </p>
                    <p className="mt-[0.5%] break-words text-[3.2cqw] text-[#2a2a2a]/85 md:text-sm">
                      {wish.message}
                    </p>
                    <p className="mt-[1%] text-[2.6cqw] italic text-[#2a2a2a]/45 md:text-xs">
                      {formatRelativeTime(wish.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
