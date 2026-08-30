import Image from "next/image";

/**
 * The couple cut-out, between the mid field and the foreground flowers.
 *
 * Same 500px design width as every other layer. The 50px bottom inset and the
 * 70px nudge are the reference template's own values; the nudge sits outside
 * scale() so it stays a flat 70px rather than scaling with the figure.
 */
export default function StageCharacterLayer() {
  return (
    <Image
      src="/images/inv_787_BSoyubpg.jpg"
      alt="Ilustrasi Vincent dan Natasha"
      width={1500}
      height={1500}
      sizes="560px"
      quality={100}
      priority
      className="absolute bottom-[50px] left-1/2 z-20 w-[500px] max-w-none ml-[-250px] h-auto pointer-events-none"
      style={{ transform: "translateY(70px) scale(0.662935)" }}
    />
  );
}
