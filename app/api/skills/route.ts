import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  try {
    const supabase = getSupabaseServer()
    let query = supabase.from("skills").select("*").eq("status", "approved").order("downloads_count", {
      ascending: false,
    })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) throw error

    const skills = (data || []).map((s) => ({
      id: s.id,
      name: s.name,
      displayName: s.display_name,
      description: s.description,
      category: s.category,
      version: s.version,
      authorName: s.author_name,
      authorUrl: s.author_url,
      githubRepoUrl: s.github_repo_url,
      downloadsCount: s.downloads_count,
      rating: s.rating,
      reviewCount: s.review_count,
      status: s.status,
      robotTypes: s.robot_types || [],
      tags: s.tags || [],
      dependencies: s.dependencies || [],
      installCommand: s.install_command,
      iconUrl: s.icon_url,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    }))

    return NextResponse.json(skills)
  } catch (err: any) {
    console.error("Skills API error:", err.message)
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}
