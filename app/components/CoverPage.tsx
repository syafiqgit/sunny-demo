import Image from "next/image";

interface Props {
  onOpen?: () => void;
}

export default function CoverPage({ onOpen }: Props) {
  return (
    <section className="relative w-full h-dvh overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cover-bg.jpg"
          alt="Vincent & Natasha"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Gradient Background */}
      <div className="absolute inset-x-0 bottom-0 z-5 h-[65%] bg-linear-to-t from-[#f5f6f1] via-[#f5f6f1]/80 to-transparent pointer-events-none" />

      {/* ALL CONTENT BLOCK */}
      <div className="absolute bottom-10 inset-x-0 z-10 flex flex-col items-center text-center px-4 w-full">
        <p className="text-[12px] text-[#333333] mb-0 font-normal">
          The Wedding of
        </p>

        {/* Micro-adjustment: Ukuran font diturunkan ke 2.25rem (mobile) & 2.5rem (tablet) */}
        <h1 className="font-script text-[2.25rem] md:text-[2.5rem] leading-[1.2] text-[#333333] my-1 whitespace-nowrap">
          Vincent & Natasha
        </h1>

        <p className="text-[12px] text-[#333333] font-normal">
          Saturday, April 25, 2026
        </p>

        <div className="h-6"></div>

        <div className="flex flex-col items-center gap-0.5">
          <p className="text-[12px] text-[#333333] font-normal">Dear,</p>
          <p className="text-[15px] font-bold text-[#333333]">Guest</p>
        </div>

        <div className="h-5"></div>

        <button
          onClick={onOpen}
          className="flex items-center justify-center gap-2.5 bg-[#786455] hover:bg-[#635246] transition-colors text-white text-[11px] font-semibold px-8 py-3.5 rounded-md uppercase tracking-[0.15em] shadow-sm"
        >
          <svg
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
      </div>
    </section>
  );
}
