"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { useReveal } from "./useReveal";

type Attendance = "yes" | "no" | "";

interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: number; // epoch ms
}

const NAME_MAX = 40;
const MESSAGE_MAX = 300;
let localIdSequence = 0;

// Seed data. GANTI/hapus setelah backend RSVP tersedia.
//
// Fixed timestamps, not `Date.now() - n`: this module is evaluated once when
// the server process starts and again in the browser, so a relative seed made
// the two disagree by however long the server had been up - and the rendered
// "x months ago" then failed hydration.
const INITIAL_WISHES: Wish[] = [
  {
    id: "seed-1",
    name: "R",
    message:
      "Congrats buat pasangan baru semoga semuanya berjalan dengan lancar!",
    createdAt: Date.parse("2026-05-30T14:00:00Z"),
  },
  {
    id: "seed-2",
    name: "Nayla",
    message: "Happy Wedding",
    createdAt: Date.parse("2026-04-12T09:00:00Z"),
  },
  {
    id: "seed-3",
    name: "Lauren",
    message: "Congrats!",
    createdAt: Date.parse("2026-01-25T17:00:00Z"),
  },
  {
    id: "seed-4",
    name: "Chelsea",
    message: "Happy wedding ❤️",
    createdAt: Date.parse("2026-01-02T08:00:00Z"),
  },
];

function formatRelativeTime(timestamp: number, now: number): string {
  const diffMs = Math.max(now - timestamp, 0);
  const days = Math.floor(diffMs / 86400000);
  const hours = Math.floor((diffMs % 86400000) / 3600000);

  if (days === 0 && hours === 0) return "Just now";
  if (days === 0) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months !== 1 ? "s" : ""} ago`;
}

// The reader's own clock, reached without a setState-in-effect. The store
// never emits: React renders the server snapshot (null) into the HTML and
// re-renders with the client one once hydration is done, which is the only
// transition this needs. The value is cached because useSyncExternalStore
// requires a stable snapshot - re-reading the clock on every render would
// spin forever - and a frozen reference point is fine for labels measured in
// hours and months.
let clientNow: number | null = null;
const subscribeNever = () => () => {};
const getNow = () => (clientNow ??= Date.now());
const getServerNow = () => null;

function createId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  localIdSequence += 1;
  return `local-${Date.now()}-${localIdSequence}`;
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

const FIELD_CLASS =
  "w-full rounded-lg border border-[#2a2a2a]/20 bg-white px-[4cqw] py-[3cqw] text-[3.4cqw] text-[#2a2a2a] shadow-sm outline-none transition-shadow placeholder:text-[#2a2a2a]/50 focus:ring-2 focus:ring-[#7a5c48]/40 disabled:opacity-60 md:px-4 md:py-2.5 md:text-sm";

export default function RsvpWishes() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("");
  const [wishes, setWishes] = useState<Wish[]>(INITIAL_WISHES);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // The page is statically prerendered, so a relative label rendered on the
  // server would be baked in at build time and could be months stale by the
  // time anyone reads it. `null` until the client clock is available; the row
  // reserves its own height below so nothing shifts when the labels land.
  const now = useSyncExternalStore(subscribeNever, getNow, getServerNow);

  const trimmedName = name.trim();
  const trimmedMessage = message.trim();

  const isValid =
    trimmedName.length > 0 &&
    trimmedName.length <= NAME_MAX &&
    trimmedMessage.length > 0 &&
    trimmedMessage.length <= MESSAGE_MAX &&
    attendance !== "";

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      if (!isValid) {
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

        setWishes((previous) => [newWish, ...previous]);
        setName("");
        setMessage("");
        setAttendance("");
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [isValid, trimmedName, trimmedMessage],
  );

  // Any edit is an attempt to fix whatever the message was complaining about,
  // so it should not outlive the next keystroke.
  const clearError = useCallback(() => setError(null), []);

  const form = useReveal("up");
  const wishList = useReveal("up", 0.1);

  return (
    <section className="relative w-full h-dvh overflow-hidden @container">
      <div className="pointer-events-auto relative z-10 flex h-full flex-col px-[6cqw] pt-[8%] pb-[4%]">
        <motion.form
          onSubmit={handleSubmit}
          noValidate
          className="flex shrink-0 flex-col gap-[3cqw] md:gap-3"
          {...form}
        >
          <label className="sr-only" htmlFor="rsvp-name">
            Name
          </label>
          <input
            id="rsvp-name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearError();
            }}
            placeholder="Name"
            maxLength={NAME_MAX}
            autoComplete="name"
            disabled={submitting}
            className={FIELD_CLASS}
          />

          <label className="sr-only" htmlFor="rsvp-message">
            Leave a Message
          </label>
          <textarea
            id="rsvp-message"
            name="message"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              clearError();
            }}
            placeholder="Leave a Message"
            rows={3}
            maxLength={MESSAGE_MAX}
            disabled={submitting}
            className={`resize-none ${FIELD_CLASS}`}
          />

          <label className="sr-only" htmlFor="rsvp-attendance">
            Confirm Attendance
          </label>
          <div className="relative">
            <select
              id="rsvp-attendance"
              name="attendance"
              value={attendance}
              onChange={(event) => {
                const value = event.target.value;
                setAttendance(value === "yes" || value === "no" ? value : "");
                clearError();
              }}
              disabled={submitting}
              className={`appearance-none ${FIELD_CLASS}`}
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
            disabled={!isValid || submitting}
            className="mt-[1%] w-full rounded-full bg-[#7a5c48] py-[3.2cqw] text-[3.4cqw] font-bold uppercase tracking-wide text-white shadow-md transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 md:py-3 md:text-sm"
          >
            {submitting ? "Sending..." : "Submit"}
          </button>
        </motion.form>

        <motion.div
          className="mt-[4%] min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-xl border border-[#2a2a2a]/15 bg-white/95 px-[4cqw] py-[2cqw] shadow-sm md:px-5 md:py-3"
          {...wishList}
        >
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
                    <p className="mt-[0.5%] wrap-break-word text-[3.2cqw] text-[#2a2a2a]/85 md:text-sm">
                      {wish.message}
                    </p>
                    <time
                      dateTime={new Date(wish.createdAt).toISOString()}
                      className="mt-[1%] block min-h-[1.2em] text-[2.6cqw] italic text-[#2a2a2a]/45 md:text-xs"
                    >
                      {now === null
                        ? null
                        : formatRelativeTime(wish.createdAt, now)}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  );
}
