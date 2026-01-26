"use client";
import dynamic from "next/dynamic";

const Iot3DModel = dynamic(() => import("./Iot3DModel"), { ssr: false });

export default function Iot3DModelClient(props: React.ComponentProps<typeof Iot3DModel>) {
  return <Iot3DModel {...props} />;
}