import Image from "next/image";

interface Props {
  onOpen?: () => void;
  hasOpened?: boolean;
}

const COUPLE_NAMES = "Vincent & Natasha";
const WEDDING_DATE = "Saturday, April 25, 2026";
const GUEST_NAME = "Guest"; // GANTI: idealnya diambil dari query param/props untuk personalisasi

export default function CoverPage({ onOpen, hasOpened }: Props) {
  return (
    <section className="relative w-full h-dvh overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cover-bg.jpg"
          alt={COUPLE_NAMES}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-5 h-[65%] bg-linear-to-t from-[#f5f6f1] via-[#f5f6f1]/80 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-10 z-10 flex w-full flex-col items-center px-4 text-center">
        <p className="mb-0 text-[12px] font-normal text-[#333333]">
          The Wedding of
        </p>
        <h1 className="my-1 whitespace-nowrap font-script text-[2.25rem] leading-[1.2] text-[#333333] md:text-[2.5rem]">
          {COUPLE_NAMES}
        </h1>
        <p className="text-[12px] font-normal text-[#333333]">{WEDDING_DATE}</p>

        <div className="h-6" />

        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[12px] font-normal text-[#333333]">Dear,</p>
          <p className="text-[15px] font-bold text-[#333333]">{GUEST_NAME}</p>
        </div>

        <div className="h-5" />

        {!hasOpened ? (
          <button
            type="button"
            onClick={onOpen}
            className="pointer-events-auto flex items-center justify-center gap-2.5 rounded-md bg-[#786455] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white shadow-sm transition-colors hover:bg-[#635246] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#786455] active:opacity-90"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Open Invitation
          </button>
        ) : (
          <div className="flex animate-bounce flex-col items-center text-[#333333]">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.1em] drop-shadow-sm">
              Scroll Down
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
