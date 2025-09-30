import { processHalftoneImage } from "../lib/halftone-processor";

interface HalftoneImageSSRProps {
  src: string;
  alt: string;
  className?: string;
  dotSize?: number;
  spacing?: number;
  shape?: string;
}

export async function HalftoneImageSSR({
  src,
  alt,
  className = "",
  dotSize = 2,
  spacing = 3,
  shape = "circle",
}: HalftoneImageSSRProps) {
  try {
    // console.log("Processing halftone image:", src);
    // Process image directly in RSC using Sharp
    const imageBuffer = await processHalftoneImage(
      src,
      400,
      spacing,
      dotSize,
      shape
    );
    // console.log("Image processed, buffer size:", imageBuffer.length);
    const base64 = imageBuffer.toString("base64");
    const dataUrl = `data:image/png;base64,${base64}`;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={dataUrl}
        alt={alt}
        className={`${className} w-full h-full object-cover`}
        style={{
          backgroundColor: "#000000",
        }}
      />
    );
  } catch (error) {
    console.error("Failed to process halftone image:", error);

    // Fallback to original image if processing fails
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`${className} w-full h-full object-cover`}
        style={{
          backgroundColor: "#000000",
        }}
      />
    );
  }
}
