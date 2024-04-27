"use client";
import { use, useEffect, useRef, useState } from "react";
import { DotLoader } from "react-spinners";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
export function WebcamComponent() {
  const webcamRef = useRef<Webcam>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const showVideo = () => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 0
    ) {
      const newwidth = webcamRef.current.video.videoWidth;
      const newheight = webcamRef.current.video.videoHeight;
      webcamRef.current.video.width = newwidth;
      webcamRef.current.video.height = newheight;
    }
  };

  useEffect(() => {
    if (webcamRef.current) {
      showVideo();
      console.log("video runing");
    }
  }, []);
  return (
    <div className="mt-8">
      <div className="relative flex justify-center items-center rounded-md p-1 bg-gradient-to-b from-white via-gray-300 to-gray-600">
        {isLoading && (
          <Webcam ref={webcamRef} className="w-full lg:h-[500px] rounded-md" />
        )}
      </div>
    </div>
  );
}
