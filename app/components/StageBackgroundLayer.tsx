import Image from "next/image";

export default function StageBackgroundLayer() {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/sunny_bg2_ext.webp"
        alt=""
        fill
        sizes="100vw"
        quality={95}
        className="object-cover object-bottom scale-[1.05]"
        priority
        aria-hidden="true"
      />
    </div>
  );
}
