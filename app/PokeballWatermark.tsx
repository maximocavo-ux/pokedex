import Image from "next/image";

export default function PokeballWatermark() {
  return (
    <Image
      src="/pokeball.svg"
      alt=""
      width={208}
      height={208}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "-40px",
        right: "-40px",
        opacity: 0.12,
        pointerEvents: "none",
      }}
    />
  );
}
