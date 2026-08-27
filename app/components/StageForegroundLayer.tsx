import Image from "next/image";

export default function StageForegroundLayer() {
  return (
    <>
      <div className="absolute bottom-0 w-full z-10 pointer-events-none">
        <Image
          src="/images/sunny_bg1_ext.webp"
          alt=""
          width={1000}
          height={1500}
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={95}
          className="w-full h-auto scale-[1.1] origin-bottom"
          aria-hidden="true"
        />
      </div>

      <div className="absolute bottom-0 w-full z-30 pointer-events-none">
        <Image
          src="/images/sunny_fg1_ext.webp"
          alt=""
          width={1000}
          height={1000}
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={95}
          className="w-full h-auto scale-[1.2] origin-bottom translate-y-[2%]"
          aria-hidden="true"
        />
      </div>

      <div className="absolute bottom-0 w-full z-40 pointer-events-none">
        <Image
          src="/images/sunny_fg2_ext.webp"
          alt=""
          width={1000}
          height={1000}
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={95}
          className="w-full h-auto scale-[1.3] origin-bottom translate-x-[3%] translate-y-[2%]"
          aria-hidden="true"
        />
      </div>
    </>
  );
}
