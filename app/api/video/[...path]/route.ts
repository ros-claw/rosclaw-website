import { NextRequest, NextResponse } from "next/server";

const R2_BASE_URL = "https://pub-471f90c3abac48ac88996b8ef195acd8.r2.dev";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const videoUrl = `${R2_BASE_URL}/${path}`;

  try {
    // Fetch from R2
    const response = await fetch(videoUrl, {
      headers: {
        // Forward range requests for video streaming
        "Range": request.headers.get("Range") || "",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Video not found" },
        { status: response.status }
      );
    }

    // Create new response with video headers
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}
