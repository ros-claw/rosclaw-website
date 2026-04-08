import { NextRequest, NextResponse } from "next/server";

// Mock database of existing packages (in production, this would be a real database)
const existingPackages = new Set([
  "rosclaw-ur-rtde-mcp",
  "rosclaw-g1-dds-mcp",
  "rosclaw-go2-mcp",
  "rosclaw-realsense-mcp",
  "pour-coffee",
  "precision-screwing",
  "gimbal-choreo",
]);

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  const type = req.nextUrl.searchParams.get("type") || "mcp"; // 'mcp' or 'skill'

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // Normalize name (kebab-case)
  const normalizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Check if exists
  const exists = existingPackages.has(normalizedName);

  return NextResponse.json({
    name: normalizedName,
    exists,
    available: !exists,
    message: exists ? `Package "${normalizedName}" already exists` : `Package "${normalizedName}" is available`,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { name, type = "mcp" } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Normalize name
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    // Check if exists
    const exists = existingPackages.has(normalizedName);

    if (exists) {
      // Suggest alternatives
      const suggestions = [
        `${normalizedName}-v2`,
        `${normalizedName}-community`,
        `${normalizedName}-${Math.floor(Math.random() * 1000)}`,
      ];

      return NextResponse.json({
        name: normalizedName,
        exists: true,
        available: false,
        message: `Package "${normalizedName}" already exists`,
        suggestions,
      });
    }

    return NextResponse.json({
      name: normalizedName,
      exists: false,
      available: true,
      message: `Package "${normalizedName}" is available`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
