"use client";
import { use, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-wasm";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
export function WebcamComponent() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  let detectModel;

  const drawCanvas = (
    objectDetected: cocoSsd.DetectedObject[],
    context: CanvasRenderingContext2D | null
  ) => {
    context?.clearRect(0, 0, context.canvas.width, context.canvas.height);
    const font = "16px sans-serif";
    context?.font != undefined ? font : "";
    context?.textBaseline != undefined ? "top" : "";

    objectDetected.forEach((box) => {
      const [x, y, width, height] = box["bbox"];
      const isPerson = box.class === "person";
      if (context?.lineWidth != undefined && context.strokeStyle != undefined) {
        context.strokeStyle = !isPerson ? "#FF0000" : "#00FFFF";
        context.lineWidth = 2;
      }
      context?.strokeRect(x, y, width, height);
      context?.fillStyle != undefined
        ? (context.fillStyle = `rgba(255,0, 0,${!isPerson ? "0.3" : "0"})`)
        : "";
      context?.fillRect(x, y, width, height);

      context?.fillStyle != undefined
        ? !isPerson
          ? "#FF0000"
          : "#00FFFF"
        : "";
      const textWidth = context?.measureText(box.class).width;
      const textHeight = parseInt(font, 10);
      if (textWidth) {
        context?.fillRect(x, y, textWidth + 4, textHeight + 4);
        context.fillStyle = "#000000";
        context.fillText(box.class, x, y);
      }
    });
  };

  const runObjectDetection = async (model: cocoSsd.ObjectDetection) => {
    if (canvasRef.current && webcamRef.current?.video) {
      console.log("runobjectdetection");
      canvasRef.current.width = webcamRef.current?.video?.videoWidth;
      canvasRef.current.height = webcamRef.current?.video?.videoHeight;

      const objectDetected = await model.detect(
        webcamRef.current.video,
        undefined,
        0.6
      );
      console.log(objectDetected);
      const context = canvasRef.current.getContext("2d");
      drawCanvas(objectDetected, context);
    }
  };

  const runModel = async () => {
    setIsLoading(true);
    const model = await cocoSsd.load();
    console.log(model);
    detectModel = setInterval(() => {
      console.log("runModel");
      runObjectDetection(model);
    }, 10);
  };
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
      tf.setBackend("wasm")
        .then(() => runModel())
        .catch(() => console.log("error"));
      console.log("detecting object");
    }
  }, []);
  return (
    <div className="mt-8">
      <div className="relative flex justify-center items-center rounded-md p-1 bg-gradient-to-b from-white via-gray-300 to-gray-600">
        {isLoading && (
          <Webcam ref={webcamRef} className="w-full lg:h-[500px] rounded-md" />
        )}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 z-[999999] w-full h-[500px]"
        ></canvas>
      </div>
    </div>
  );
}
