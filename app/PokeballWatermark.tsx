import Image from "next/image";

export default function PokeballWatermark() {
  return (
    <Image
      src="/pokeball.svg"
      alt=""
      width={380}
      height={380}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "-90px",
        right: "-60px",
        opacity: 0.1,
        pointerEvents: "none",
      }}
    />
  );
}
