import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { processHalftoneImage } from "../../../lib/halftone-processor";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");
    const size = parseInt(searchParams.get("size") || "400");
    const spacing = parseInt(searchParams.get("spacing") || "3");
    const dotSize = parseInt(searchParams.get("dotSize") || "2");
    const shape = searchParams.get("shape") || "circle";
    const format = searchParams.get("format") || "png";

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    const imageBuffer = await processHalftoneImage(
      imageUrl,
      size,
      spacing,
      dotSize,
      shape,
      format
    );

    const base64 = imageBuffer.toString("base64");
    const mimeType = format === "svg" ? "image/svg+xml" : "image/png";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({ dataUrl });
  } catch (error) {
    console.error("Halftone processing error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
