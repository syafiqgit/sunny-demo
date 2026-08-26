"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

type Attendance = "yes" | "no" | "";

interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: number; // epoch ms — dihitung ulang tiap render, bukan string statis
}

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

  if (days === 0 && hours === 0) return "just now";
  if (days === 0) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  return `${days} day${days !== 1 ? "s" : ""} ${hours} hour${
    hours !== 1 ? "s" : ""
  } ago`;
}

export default function RsvpWishes() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("");
  const [wishes, setWishes] = useState<Wish[]>(INITIAL_WISHES);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    name.trim().length > 0 && message.trim().length > 0 && attendance !== "";

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!canSubmit) {
        setError("Please fill in your name, message, and attendance.");
        return;
      }

      // TODO: ganti dengan panggilan API nyata (mis. POST /api/rsvp).
      // Saat ini hanya mutasi local state — TIDAK persist ke server,
      // TIDAK sinkron antar pengunjung. Jangan anggap ini "selesai"
      // sampai backend-nya ada.
      const newWish: Wish = {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `local-${Date.now()}`,
        name: name.trim(),
        message: message.trim(),
        createdAt: Date.now(),
      };

      setWishes((prev) => [newWish, ...prev]);
      setName("");
      setMessage("");
      setAttendance("");
      setError(null);
    },
    [canSubmit, name, message],
  );

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden [container-type:inline-size]">
      <div className="pointer-events-auto relative z-10 flex h-full flex-col px-[6cqw] pt-[8%] pb-[4%]">
        <form
          onSubmit={handleSubmit}
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
            className="w-full rounded-lg border border-[#2a2a2a]/20 bg-white px-[4cqw] py-[3cqw] text-[3.4cqw] text-[#2a2a2a] shadow-sm placeholder:text-[#2a2a2a]/50 focus:outline-none focus:ring-2 focus:ring-[#7a5c48]/40 md:px-4 md:py-2.5 md:text-sm"
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
            className="w-full resize-y rounded-lg border border-[#2a2a2a]/20 bg-white px-[4cqw] py-[3cqw] text-[3.4cqw] text-[#2a2a2a] shadow-sm placeholder:text-[#2a2a2a]/50 focus:outline-none focus:ring-2 focus:ring-[#7a5c48]/40 md:px-4 md:py-2.5 md:text-sm"
          />

          <label className="sr-only" htmlFor="rsvp-attendance">
            Confirm Attendance
          </label>
          <div className="relative">
            <select
              id="rsvp-attendance"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value as Attendance)}
              className="w-full appearance-none rounded-lg border border-[#2a2a2a]/20 bg-white px-[4cqw] py-[3cqw] text-[3.4cqw] text-[#2a2a2a] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7a5c48]/40 md:px-4 md:py-2.5 md:text-sm"
            >
              <option value="" disabled>
                Confirm Attendance
              </option>
              <option value="yes">Yes, I will attend</option>
              <option value="no">Sorry, can&apos;t make it</option>
            </select>
            <svg
              aria-hidden
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
            className="mt-[1%] w-full rounded-full bg-[#7a5c48] py-[3.2cqw] text-[3.4cqw] font-bold uppercase tracking-wide text-white shadow-md active:opacity-90 md:py-3 md:text-sm"
          >
            Submit
          </button>
        </form>

        <div className="mt-[4%] min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-xl border border-[#2a2a2a]/15 bg-white/95 px-[4cqw] py-[3cqw] shadow-sm md:px-5 md:py-4">
          <ul className="flex flex-col">
            {wishes.map((wish, i) => (
              <li
                key={wish.id}
                className={`py-[3cqw] md:py-3 ${
                  i > 0 ? "border-t border-[#2a2a2a]/10" : ""
                }`}
              >
                <p className="text-[3.6cqw] font-bold text-[#5a3d2b] md:text-base">
                  {wish.name}
                </p>
                <p className="mt-[1%] break-words text-[3.2cqw] text-[#2a2a2a]/85 md:text-sm">
                  {wish.message}
                </p>
                <p className="mt-[1%] text-[2.6cqw] italic text-[#2a2a2a]/45 md:text-xs">
                  {formatRelativeTime(wish.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
