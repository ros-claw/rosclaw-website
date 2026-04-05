import { NextRequest, NextResponse } from "next/server";

const R2_BASE_URL = "https://pub-471f90c3abac48ac88996b8ef195acd8.r2.dev";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const videoUrl = `${R2_BASE_URL}/${path}`;

  console.log("Proxying video request:", videoUrl);

  try {
    // Prepare headers - only add Range if present
    const headers: Record<string, string> = {};
    const rangeHeader = request.headers.get("Range");
    if (rangeHeader) {
      headers["Range"] = rangeHeader;
    }

    // Fetch from R2
    const response = await fetch(videoUrl, {
      headers,
    });

    if (!response.ok) {
      console.error("R2 fetch failed:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Video not found", url: videoUrl },
        { status: response.status }
      );
    }

    // Create new response with video headers
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("Cache-Control", "public, max-age=31536000, immutable");

    // Ensure proper content-type for video
    if (!responseHeaders.has("Content-Type")) {
      responseHeaders.set("Content-Type", "video/mp4");
    }

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Video proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch video", details: String(error) },
      { status: 500 }
    );
  }
}
