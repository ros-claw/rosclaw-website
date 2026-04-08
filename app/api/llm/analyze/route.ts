import { NextRequest, NextResponse } from "next/server";

const BAILIAN_API_KEY = process.env.BAILIAN_API_KEY;
const BAILIAN_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";

export async function POST(req: NextRequest) {
  try {
    if (!BAILIAN_API_KEY) {
      return NextResponse.json(
        { error: "BAILIAN_API_KEY not configured" },
        { status: 500 }
      );
    }

    const { readmeContent, repoName, repoDescription } = await req.json();

    if (!readmeContent) {
      return NextResponse.json(
        { error: "README content is required" },
        { status: 400 }
      );
    }

    // Prepare the prompt for LLM
    const prompt = `Analyze this GitHub repository and extract MCP (Model Context Protocol) tools information.

Repository: ${repoName}
Description: ${repoDescription || "N/A"}

README Content:
${readmeContent.slice(0, 8000)}

Please analyze the README and extract:
1. MCP Tools: List of functions/tools this MCP server provides (name and description)
2. Category: The hardware/software category (e.g., Manipulators, Cameras, Sensors)
3. Robot Type: Specific robot/hardware this works with (e.g., UR5, Franka, G1)
4. Tags: Relevant keywords for searching

Respond ONLY in this JSON format:
{
  "tools": [
    {"name": "tool_name", "description": "What this tool does"}
  ],
  "category": "Category Name",
  "robotType": "Robot/Hardware Name",
  "tags": ["tag1", "tag2"]
}

If you cannot determine a field, use empty string or empty array.`;

    // Call Bailian API (OpenAI compatible)
    const response = await fetch(`${BAILIAN_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BAILIAN_API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing robotics and MCP server documentation. Extract structured information accurately."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Bailian API error:", error);
      return NextResponse.json(
        { error: "LLM analysis failed", details: error },
        { status: 500 }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content from LLM" },
        { status: 500 }
      );
    }

    // Parse JSON from LLM response
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                        content.match(/```\s*([\s\S]*?)\s*```/) ||
                        [null, content];
      const jsonStr = jsonMatch[1] || content;
      const parsed = JSON.parse(jsonStr);

      return NextResponse.json({
        success: true,
        data: {
          tools: parsed.tools || [],
          category: parsed.category || "",
          robotType: parsed.robotType || "",
          tags: parsed.tags || [],
        }
      });
    } catch (parseError) {
      console.error("Failed to parse LLM response:", content);
      return NextResponse.json(
        { error: "Failed to parse LLM response", raw: content },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
