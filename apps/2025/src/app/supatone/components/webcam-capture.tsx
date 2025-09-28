"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface WebcamCaptureProps {
  onCapture: (file: File) => void;
  disabled?: boolean;
}

export function WebcamCapture({ onCapture, disabled }: WebcamCaptureProps) {
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isWebcamLoading, setIsWebcamLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startWebcam = useCallback(async () => {
    console.log("Starting webcam...");
    setError(null);
    setIsWebcamLoading(true);

    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Webcam not supported in this browser.");
      setIsWebcamLoading(false);
      return;
    }

    try {
      console.log("Requesting camera access...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      });

      console.log("Camera access granted, stream:", stream);
      streamRef.current = stream;

      // Set webcam as active first, which will render the video element
      setIsWebcamActive(true);

      // Then set the stream after a small delay to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
          console.log("Video element set with stream");

          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded");
            setIsWebcamLoading(false); // Stop loading when video is ready
          };

          // Fallback to stop loading after 3 seconds if onloadedmetadata doesn't fire
          setTimeout(() => {
            setIsWebcamLoading(false);
          }, 3000);
        } else {
          console.error("Video element still not found after delay");
          setError("Failed to initialize video element.");
          setIsWebcamLoading(false);
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing webcam:", err);

      let errorMessage = "Failed to access webcam. ";
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage += "Please allow camera permissions and try again.";
        } else if (err.name === "NotReadableError") {
          errorMessage += "Camera is being used by another application.";
        } else if (err.name === "NotFoundError") {
          errorMessage += "No camera found on this device.";
        } else {
          errorMessage += `Error: ${err.message}`;
        }
      } else {
        errorMessage += "Unknown error occurred.";
      }

      setError(errorMessage);
      setIsWebcamLoading(false);
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
    setIsWebcamLoading(false);
    setCountdown(null);
    setIsCapturing(false);
  }, []);

  const startCountdown = useCallback(() => {
    if (isCapturing) return;

    setIsCapturing(true);
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          // Capture the photo after countdown
          setTimeout(capturePhoto, 100);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isCapturing]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob and create file
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `webcam-capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          onCapture(file);
          stopWebcam(); // Stop webcam after capture
        }
      },
      "image/jpeg",
      0.9
    );

    setIsCapturing(false);
  }, [onCapture, stopWebcam]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium font-mono">Webcam Capture</h3>
        <div className="flex gap-2">
          {!isWebcamActive ? (
            <button
              onClick={startWebcam}
              disabled={disabled || isWebcamLoading}
              className="px-4 py-2 bg-brand-green-default text-black hover:bg-brand-green-600 transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWebcamLoading ? "Starting..." : "Start Webcam"}
            </button>
          ) : (
            <>
              <button
                onClick={startCountdown}
                disabled={disabled || isCapturing || isWebcamLoading}
                className="px-4 py-2 bg-brand-green-default text-black hover:bg-brand-green-600 transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCapturing ? "Capturing..." : "Take Pic"}
              </button>
              <button
                onClick={stopWebcam}
                disabled={disabled}
                className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors font-mono border border-column-lines disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Stop Webcam
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 font-mono">{error}</p>
        </div>
      )}

      {isWebcamLoading && (
        <div className="mb-4 p-6 border border-column-lines bg-black">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-4 grid grid-cols-4 gap-1">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-brand-green-default animate-pulse"
                  style={{
                    animationDelay: `${i * 100}ms`,
                    animationDuration: "1.6s",
                  }}
                />
              ))}
            </div>
            <p className="text-white font-mono">Starting webcam...</p>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              Please allow camera permissions if prompted
            </p>
          </div>
        </div>
      )}

      {isWebcamActive && (
        <div className="relative border border-column-lines bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-2xl mx-auto block"
          />

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-8xl font-mono font-bold text-brand-green-default animate-pulse">
                {countdown}
              </div>
            </div>
          )}

          {/* Flash effect when capturing */}
          {isCapturing && countdown === null && (
            <div className="absolute inset-0 bg-white opacity-50 animate-pulse" />
          )}
        </div>
      )}

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
