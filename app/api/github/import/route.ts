import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { repoUrl, token } = await req.json()

    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json({ error: "repoUrl is required" }, { status: 400 })
    }

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    // Parse GitHub URL to get owner and repo
    const url = new URL(repoUrl.replace(/^https?:\/\/github\.com\//, "https://api.github.com/repos/"))

    const { pathname } = url
    const parts = pathname.split("/").filter(Boolean)

    if (parts.length < 2) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 })
    }

    const [owner, repo] = parts
    if (!owner || !repo) {
      return NextResponse.json({ error: "Invalid GitHub URL format" }, { status: 400 })
    }

    const apiUrlBase = `https://api.github.com/repos/${owner}/${repo}`

    // Fetch repo metadata
    const [repoRes, readmeRes] = await Promise.all([
      fetch(apiUrlBase, { headers }),
      fetch(`${apiUrlBase}/readme`, { headers }),
    ])

    if (!repoRes.ok) {
      return NextResponse.json(
        { error: `Failed to fetch repo: ${repoRes.statusText}` },
        { status: repoRes.status }
      )
    }

    const repoData = await repoRes.json()
    let readmeContent = ""

    if (readmeRes.ok) {
      const readmeData = await readmeRes.json()
      if (readmeData.content) {
        try {
          readmeContent = Buffer.from(readmeData.content, "base64").toString("utf-8")
        } catch {
          readmeContent = ""
        }
      }
    }

    // Extract tags from README keywords
    const keywordsMatch = readmeContent.match(/keywords["\s:]+\[([^\]]+)\]/i)
    const tags: string[] = keywordsMatch
      ? keywordsMatch[1].split(",").map((t) => t.trim()).filter(Boolean)
      : []

    // Determine type based on repo name/content
    const robotType = extractRobotType(repo) || null
    const category = inferCategory(repo, tags)

    return NextResponse.json({
      name: repo,
      displayName: repoData.full_name,
      description: repoData.description || "",
      longDescription: readmeContent,
      githubRepoUrl: repoData.html_url,
      authorName: repoData.owner?.login || owner,
      tags: tags.length > 0 ? tags : guessTags(repo),
      category,
      robotType,
    })
  } catch (err: any) {
    console.error("GitHub import error:", err.message)
    return NextResponse.json({ error: "Failed to import repo" }, { status: 500 })
  }
}

function extractRobotType(name: string): string | null {
  const lower = name.toLowerCase()
  if (lower.includes("g1") || lower.includes("unitree")) return "humanoid"
  if (lower.includes("ur5") || lower.includes("ur10") || lower.includes("ur3")) return "manipulator"
  if (lower.includes("franka") || lower.includes("panda")) return "manipulator"
  if (lower.includes("turtlebot")) return "mobile"
  return null
}

function inferCategory(name: string, tags: string[]): string {
  const check = (t: string) => name.toLowerCase().includes(t) || tags.some((tag) => tag.toLowerCase().includes(t))
  if (check("mcp") || check("server")) return "mcp_package"
  if (check("skill") || check("manipulation") || check("grasp")) return "skill"
  return "mcp_package"
}

function guessTags(name: string): string[] {
  const lower = name.toLowerCase()
  if (lower.includes("ur5")) return ["ur5", "manipulator", "ros2"]
  if (lower.includes("g1")) return ["g1", "humanoid", "unitree"]
  if (lower.includes("turtlebot")) return ["turtlebot", "mobile", "navigation"]
  if (lower.includes("realsense")) return ["realsense", "camera", "vision"]
  return ["mcp", "rosclaw", lower.split("-")[0]]
}
