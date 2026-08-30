import Image from "next/image";

/**
 * The three flower bands, back to front: the mid field the couple stands in,
 * then two foreground clumps drawn over them.
 *
 * All three share the 500px design width, sit on the stage's bottom edge and
 * are scaled well past it - that heavy overlap is what buries the stalks. The
 * scales and the sideways nudges are the reference template's own computed
 * values. The translateX sits inside scale() so it scales with the layer,
 * matching how the reference composes its matrix.
 */
export default function StageForegroundLayer() {
  return (
    <>
      <Image
        src="/images/sunny_bg1_ext.webp"
        alt=""
        width={1500}
        height={708}
        sizes="1150px"
        quality={95}
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 z-10 w-[500px] max-w-none ml-[-250px] h-auto pointer-events-none"
        style={{ transform: "translateY(8.03px) scale(1.36293)" }}
      />

      <Image
        src="/images/sunny_fg2_ext.webp"
        alt=""
        width={1500}
        height={568}
        sizes="1600px"
        quality={95}
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 z-30 w-[500px] max-w-none ml-[-250px] h-auto pointer-events-none"
        style={{ transform: "translateY(-1.31px) scale(1.89749) translateX(139.08px)" }}
      />

      <Image
        src="/images/sunny_fg1_ext.webp"
        alt=""
        width={1500}
        height={568}
        sizes="1750px"
        quality={95}
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 z-40 w-[500px] max-w-none ml-[-250px] h-auto pointer-events-none"
        style={{ transform: "translateY(8.03px) scale(2.06467) translateX(100.06px)" }}
      />
    </>
  );
}
