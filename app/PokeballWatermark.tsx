import Image from "next/image";

export default function PokeballWatermark() {
  return (
    <Image
      src="/pokeball.svg"
      alt=""
      width={380}
      height={380}
      aria-hidden="true"
      className="absolute opacity-10 pointer-events-none"
      style={{
        top: "-90px",
        right: "-60px",
      }}
    />
  );
}
