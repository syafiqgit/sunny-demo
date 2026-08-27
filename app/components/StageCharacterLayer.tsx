import Image from "next/image";

export default function StageCharacterLayer() {
  return (
    <div className="absolute bottom-[18cqw] left-1/2 -translate-x-1/2 w-[58%] max-w-85 z-20 pointer-events-none">
      <Image
        src="/images/inv_787_BSoyubpg.jpg"
        alt="Ilustrasi Vincent dan Natasha"
        width={600}
        height={900}
        sizes="(max-width: 768px) 58vw, 340px"
        quality={100}
        className="w-full h-auto drop-shadow-md"
        priority
      />
    </div>
  );
}
