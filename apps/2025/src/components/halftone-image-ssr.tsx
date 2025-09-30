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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dotSize = 2,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  spacing = 3,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shape = "circle",
}: HalftoneImageSSRProps) {
  // Temporarily disabled to prevent infinite loop
  // TODO: Re-enable when halftone API is fixed
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
