"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, useWatch } from "react-hook-form";
import { SettingsForm } from "./components/settings-form";
import { WebcamCapture } from "./components/webcam-capture";

export default function SupatonePage() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultSvg, setResultSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  type FormData = {
    spacing: number;
    dotSize: number;
    size: number;
    shape: "circle" | "square";
    uniformSize: boolean;
  };

  const { control } = useForm<FormData>({
    defaultValues: {
      spacing: 5,
      dotSize: 1.75,
      size: 400,
      shape: "circle",
      uniformSize: false,
    },
  });

  const settings = useWatch({
    control,
    defaultValue: {
      spacing: 5,
      dotSize: 1.75,
      size: 400,
      shape: "circle" as const,
      uniformSize: false,
    },
  });

  const processImageFromFile = useCallback(
    async (file: File) => {
      setProcessing(true);
      setError(null);

      try {
        console.log("Processing file:", file.name, file.type);

        // Upload file directly to API using FormData for PNG
        const formDataPng = new FormData();
        formDataPng.append("image", file);
        formDataPng.append("spacing", (settings.spacing ?? 5).toString());
        formDataPng.append("dotSize", (settings.dotSize ?? 1.75).toString());
        formDataPng.append("size", (settings.size ?? 400).toString());
        formDataPng.append("shape", settings.shape ?? "circle");
        formDataPng.append(
          "uniformSize",
          (settings.uniformSize ?? false).toString()
        );
        formDataPng.append("format", "png");

        const responsePng = await fetch("/api/supatone", {
          method: "POST",
          body: formDataPng,
        });

        if (!responsePng.ok) {
          const errorText = await responsePng.text();
          throw new Error(
            `Failed to process PNG: ${responsePng.status} - ${errorText}`
          );
        }
        const blobPng = await responsePng.blob();
        setResult(URL.createObjectURL(blobPng));

        // Upload file directly to API using FormData for SVG
        const formDataSvg = new FormData();
        formDataSvg.append("image", file);
        formDataSvg.append("spacing", (settings.spacing ?? 5).toString());
        formDataSvg.append("dotSize", (settings.dotSize ?? 1.75).toString());
        formDataSvg.append("size", (settings.size ?? 400).toString());
        formDataSvg.append("shape", settings.shape ?? "circle");
        formDataSvg.append(
          "uniformSize",
          (settings.uniformSize ?? false).toString()
        );
        formDataSvg.append("format", "svg");

        const responseSvg = await fetch("/api/supatone", {
          method: "POST",
          body: formDataSvg,
        });

        if (!responseSvg.ok) {
          const errorText = await responseSvg.text();
          throw new Error(
            `Failed to process SVG: ${responseSvg.status} - ${errorText}`
          );
        }
        const svgText = await responseSvg.text();
        setResultSvg(svgText);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to process image"
        );
      } finally {
        setProcessing(false);
      }
    },
    [settings]
  );

  const processImageFromUrl = useCallback(
    async (imageUrl: string) => {
      setProcessing(true);
      setError(null);

      try {
        // Use GET request for PNG
        const paramsPng = new URLSearchParams({
          src: imageUrl,
          spacing: (settings.spacing ?? 5).toString(),
          dotSize: (settings.dotSize ?? 1.75).toString(),
          size: (settings.size ?? 400).toString(),
          shape: settings.shape ?? "circle",
          uniformSize: (settings.uniformSize ?? false).toString(),
          format: "png",
        });
        const responsePng = await fetch(`/api/supatone?${paramsPng}`);

        if (!responsePng.ok) {
          const errorText = await responsePng.text();
          throw new Error(
            `Failed to process PNG: ${responsePng.status} - ${errorText}`
          );
        }
        const blobPng = await responsePng.blob();
        setResult(URL.createObjectURL(blobPng));

        // Use GET request for SVG
        const paramsSvg = new URLSearchParams({
          src: imageUrl,
          spacing: (settings.spacing ?? 5).toString(),
          dotSize: (settings.dotSize ?? 1.75).toString(),
          size: (settings.size ?? 400).toString(),
          shape: settings.shape ?? "circle",
          uniformSize: (settings.uniformSize ?? false).toString(),
          format: "svg",
        });
        const responseSvg = await fetch(`/api/supatone?${paramsSvg}`);

        if (!responseSvg.ok) {
          const errorText = await responseSvg.text();
          throw new Error(
            `Failed to process SVG: ${responseSvg.status} - ${errorText}`
          );
        }
        const svgText = await responseSvg.text();
        setResultSvg(svgText);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to process image"
        );
      } finally {
        setProcessing(false);
      }
    },
    [settings]
  );

  // Custom hook for reprocessing when settings change
  const reprocessImage = useCallback(() => {
    if (currentFile) {
      processImageFromFile(currentFile);
    } else if (currentUrl.trim()) {
      processImageFromUrl(currentUrl.trim());
    }
  }, [currentFile, currentUrl, processImageFromFile, processImageFromUrl]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setCurrentFile(file);
      setCurrentUrl(""); // Clear URL when file is dropped
      setResult(null);
      setResultSvg(null);
      await processImageFromFile(file);
    },
    [processImageFromFile]
  );

  const handleUrlSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUrl.trim()) return;

      setCurrentFile(null); // Clear file when URL is used
      setResult(null);
      setResultSvg(null);
      await processImageFromUrl(currentUrl.trim());
    },
    [currentUrl, processImageFromUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
    },
    multiple: false,
  });

  const downloadPng = () => {
    if (!result) return;

    const link = document.createElement("a");
    link.href = result;
    link.download = `supatone-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSvg = () => {
    if (!resultSvg) return;

    const blob = new Blob([resultSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `supatone-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!result) return;

    try {
      const response = await fetch(result);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      // Show success feedback (you could add a toast here)
      console.log("Image copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy image:", err);
      // Fallback: copy the blob URL as text
      try {
        await navigator.clipboard.writeText(result);
        console.log("Image URL copied to clipboard as fallback");
      } catch (textErr) {
        console.error("Failed to copy URL:", textErr);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-medium mb-4 font-mono">
            Supatone Generator
          </h1>
          <p className="text-muted-foreground font-mono">
            Drop an image to generate a halftone effect with Supabase brand
            colors
          </p>
        </div>

        {/* Settings */}
        <SettingsForm control={control} onSettingsChange={reprocessImage} />

        {/* Webcam Capture */}
        <WebcamCapture
          onCapture={(file) => {
            setCurrentFile(file);
            setCurrentUrl(""); // Clear URL when webcam captures
            setResult(null);
            setResultSvg(null);
            processImageFromFile(file);
          }}
          disabled={processing}
        />

        {/* URL Input */}
        <div className="mb-8">
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <input
              type="url"
              value={currentUrl}
              onChange={(e) => setCurrentUrl(e.target.value)}
              placeholder="Or paste an image URL here..."
              className="flex-1 bg-black border border-column-lines px-3 py-2 font-mono text-white placeholder-muted-foreground"
              disabled={processing}
            />
            <button
              type="submit"
              disabled={processing || !currentUrl.trim()}
              className="px-4 py-2 bg-brand-green-default text-black hover:bg-brand-green-600 transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Process URL
            </button>
          </form>
        </div>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-brand-green-default bg-brand-green-default/10"
              : "border-column-lines hover:border-brand-green-default/50"
          }`}
        >
          <input {...getInputProps()} />
          {processing ? (
            <div>
              <div className="w-16 h-16 mx-auto mb-4 grid grid-cols-4 gap-1">
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
              <p className="font-mono">Processing image...</p>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 bg-muted border border-column-lines mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-muted-foreground"></div>
              </div>
              {isDragActive ? (
                <p className="font-mono">Drop the image here...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2 font-mono">
                    Drop an image here, or click to select
                  </p>
                  <p className="text-sm text-muted-foreground font-mono">
                    Supports PNG, JPG, GIF, WebP, SVG
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 font-mono">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium font-mono">Result</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors font-mono border border-column-lines"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={downloadPng}
                  className="px-4 py-2 bg-brand-green-default text-black hover:bg-brand-green-600 transition-colors font-mono"
                >
                  Download PNG
                </button>
                <button
                  onClick={downloadSvg}
                  disabled={!resultSvg}
                  className="px-4 py-2 bg-brand-green-default text-black hover:bg-brand-green-600 transition-colors font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Download SVG
                </button>
              </div>
            </div>
            <div className="border border-column-lines p-4 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result}
                alt="Supatone result"
                className="max-w-full h-auto mx-auto"
                style={{ backgroundColor: "#000000" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
