import { WebcamComponent } from "@/components/webcam-detection";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <h1 className="text-3xl md:text-5xl lg:text-7xl  tracking-tighter md:px-6 font-bold text-center text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-600">
        Eye Spy App
      </h1>
      <WebcamComponent />
    </main>
  );
}
