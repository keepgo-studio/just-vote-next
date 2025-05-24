import Image from "next/image";

export default function Logo({
  width,
  height
}: {
  width: number;
  height: number;
}) {
  return (
    <div>
      <Image width={width} height={height} src="/assets/logo.png" alt="logo"/>
    </div>
  )
}