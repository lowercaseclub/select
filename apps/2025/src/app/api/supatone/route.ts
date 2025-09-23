import { NextRequest } from "next/server";
import { processHalftoneImage } from "../../../lib/halftone-processor";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("src");
    const size = parseInt(searchParams.get("size") || "400");
    const spacing = parseInt(searchParams.get("spacing") || "3");
    const dotSize = parseFloat(searchParams.get("dotSize") || "2");
    const shape = searchParams.get("shape") || "circle";
    const format = searchParams.get("format") || "png";
    const uniformSize = searchParams.get("uniformSize") === "true";

    if (!imageUrl) {
      return new Response("Missing src parameter", { status: 400 });
    }

    // console.log("API: Processing halftone image:", imageUrl);

    // Use the same processor as the SSR component
    const result = await processHalftoneImage(
      imageUrl,
      size,
      spacing,
      dotSize,
      shape,
      format,
      uniformSize
    );

    if (format === "svg") {
      // console.log("API: SVG processed, length:", (result as string).length);
      return new Response(result as string, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // console.log("API: PNG processed, buffer size:", (result as Buffer).length);

    // Return PNG image with caching headers
    return new Response(new Uint8Array(result as Buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable", // Cache for 1 year
      },
    });
  } catch (error) {
    console.error("API: Error processing halftone image:", error);
    return new Response("Error processing image", { status: 500 });
  }
}

// Handle POST requests with FormData
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const size = parseInt((formData.get("size") as string) || "400");
    const spacing = parseInt((formData.get("spacing") as string) || "3");
    const dotSize = parseFloat((formData.get("dotSize") as string) || "2");
    const shape = (formData.get("shape") as string) || "circle";
    const format = (formData.get("format") as string) || "png";
    const uniformSize = (formData.get("uniformSize") as string) === "true";

    if (!imageFile) {
      return new Response("Missing image file", { status: 400 });
    }

    // console.log(
    //   "API POST: Processing uploaded file:",
    //   imageFile.name,
    //   imageFile.type
    // );

    // Convert file to buffer and create data URL
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${imageFile.type};base64,${base64}`;

    // console.log("API POST: Created data URL, length:", dataUrl.length);

    // Use the same processor as the SSR component
    const result = await processHalftoneImage(
      dataUrl,
      size,
      spacing,
      dotSize,
      shape,
      format,
      uniformSize
    );

    if (format === "svg") {
      // console.log(
      //   "API POST: SVG processed, length:",
      //   (result as string).length
      // );
      return new Response(result as string, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "no-cache",
        },
      });
    }

    // console.log(
    //   "API POST: PNG processed, buffer size:",
    //   (result as Buffer).length
    // );

    // Return PNG image
    return new Response(new Uint8Array(result as Buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache", // Don't cache uploaded images
      },
    });
  } catch (error) {
    console.error("API POST: Error processing halftone image:", error);
    return new Response(
      `Error processing image: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 500 }
    );
  }
}
