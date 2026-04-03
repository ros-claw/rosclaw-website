import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  try {
    const supabase = getSupabaseServer()
    let query = supabase
      .from("mcp_packages")
      .select("*")
      .eq("status", "approved")
      .order("downloads_count", { ascending: false })

    if (category && category !== "all") {
      query = query.eq("robot_type", category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query
    if (error) throw error

    const packages = (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      displayName: p.display_name,
      description: p.description,
      category: p.category,
      version: p.version,
      authorName: p.author_name,
      verified: p.verified,
      githubRepoUrl: p.github_repo_url,
      downloadsCount: p.downloads_count,
      rating: p.rating,
      reviewCount: p.review_count,
      rosVersion: p.ros_version,
      safetyCert: p.safety_cert,
      pythonVersion: p.python_version,
      status: p.status,
      robotType: p.robot_type,
      tags: p.tags || [],
      tools: p.tools || [],
      installCommand: p.install_command,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }))

    return NextResponse.json(packages)
  } catch (err: any) {
    console.error("MCP Packages API error:", err.message)
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 })
  }
}
