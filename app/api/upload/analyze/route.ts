import { NextRequest, NextResponse } from "next/server";
import { unzipSync } from "zlib";

const BAILIAN_API_KEY = process.env.BAILIAN_API_KEY;
const BAILIAN_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";

// Helper to decode base64
function base64ToBuffer(base64: string): Buffer {
  return Buffer.from(base64.replace(/^data:.*;base64,/, ""), "base64");
}

// Helper to extract text files from zip
function extractFilesFromZip(zipBuffer: Buffer): { [path: string]: string } {
  try {
    const unzipped = unzipSync(zipBuffer) as unknown as { [key: string]: Buffer };
    const files: { [path: string]: string } = {};

    for (const [path, buf] of Object.entries(unzipped)) {
      // Only process text files under 50KB
      if (buf.length < 50000) {
        try {
          const content = buf.toString("utf-8");
          // Keep only code and markdown files
          if (
            path.match(/\.(md|txt|json|yaml|yml|py|js|ts|go|rs|c|cpp|h|hpp)$/i) ||
            path.includes("README") ||
            path.includes("SKILL") ||
            path.includes("package")
          ) {
            files[path] = content;
          }
        } catch {
          // Binary file, skip
        }
      }
    }

    return files;
  } catch (error) {
    throw new Error("Failed to extract zip file: " + (error as Error).message);
  }
}

// Find SKILL.md or README.md
function findMainDoc(files: { [path: string]: string }): string {
  const paths = Object.keys(files);

  // Priority order
  const priority = ["SKILL.md", "README.md", "skill.md", "readme.md"];
  for (const doc of priority) {
    const found = paths.find((p) => p.toLowerCase().endsWith(doc.toLowerCase()));
    if (found) return files[found];
  }

  // Return first markdown file
  const firstMd = paths.find((p) => p.endsWith(".md"));
  if (firstMd) return files[firstMd];

  return "";
}

export async function POST(req: NextRequest) {
  try {
    if (!BAILIAN_API_KEY) {
      return NextResponse.json(
        { error: "BAILIAN_API_KEY not configured" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string || "mcp"; // 'mcp' or 'skill'

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.name.endsWith(".zip")) {
      return NextResponse.json(
        { error: "Only .zip files are supported" },
        { status: 400 }
      );
    }

    // Read and extract zip
    const buffer = Buffer.from(await file.arrayBuffer());
    const files = extractFilesFromZip(buffer);

    if (Object.keys(files).length === 0) {
      return NextResponse.json(
        { error: "No readable files found in zip" },
        { status: 400 }
      );
    }

    // Find main documentation
    const mainDoc = findMainDoc(files);
    if (!mainDoc) {
      return NextResponse.json(
        { error: `${type === "skill" ? "SKILL.md" : "README.md"} is required` },
        { status: 400 }
      );
    }

    // Get file list for context
    const fileList = Object.keys(files).slice(0, 50).join("\n");

    // Analyze with LLM
    const prompt =
      type === "skill"
        ? `Analyze this skill package and extract publishing information.

File structure:
${fileList}

Main documentation (SKILL.md/README):
${mainDoc.slice(0, 8000)}

Extract the following for publishing:
1. name: Package slug (kebab-case, from filename or doc)
2. displayName: Human-readable name
3. description: Short description
4. version: Version number
5. category: Skill category (Manipulation, Navigation, Computer Vision, Grasping, Assembly, Social, Planning, Control)
6. robotTypes: Compatible robots (array)
7. tags: Search keywords (array)
8. skillMd: Full markdown content for documentation

Respond ONLY in JSON:
{
  "name": "",
  "displayName": "",
  "description": "",
  "version": "1.0.0",
  "category": "",
  "robotTypes": [],
  "tags": [],
  "skillMd": ""
}`
        : `Analyze this MCP package and extract publishing information.

File structure:
${fileList}

Main documentation (README.md):
${mainDoc.slice(0, 8000)}

Extract the following for publishing:
1. name: Package slug (kebab-case)
2. displayName: Human-readable name
3. description: Short description
4. version: Version number
5. category: Hardware category (Manipulators, Humanoids, Mobile Bases, Sensors, Grippers, Cameras, End Effectors)
6. robotType: Specific robot/hardware this works with
7. tags: Search keywords (array)
8. tools: MCP tools provided (array of {name, description})
9. readmeMd: Full markdown content

Respond ONLY in JSON:
{
  "name": "",
  "displayName": "",
  "description": "",
  "version": "1.0.0",
  "category": "",
  "robotType": "",
  "tags": [],
  "tools": [],
  "readmeMd": ""
}`;

    const llmResponse = await fetch(`${BAILIAN_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BAILIAN_API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert at analyzing robotics packages. Extract accurate structured information.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!llmResponse.ok) {
      const error = await llmResponse.text();
      return NextResponse.json(
        { error: "LLM analysis failed", details: error },
        { status: 500 }
      );
    }

    const result = await llmResponse.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content from LLM" },
        { status: 500 }
      );
    }

    // Parse JSON response
    try {
      const jsonMatch =
        content.match(/```json\s*([\s\S]*?)\s*```/) ||
        content.match(/```\s*([\s\S]*?)\s*```/) || [null, content];
      const jsonStr = jsonMatch[1] || content;
      const parsed = JSON.parse(jsonStr);

      return NextResponse.json({
        success: true,
        data: parsed,
        filesAnalyzed: Object.keys(files).length,
      });
    } catch (parseError) {
      return NextResponse.json(
        { error: "Failed to parse LLM response", raw: content },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Upload analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
