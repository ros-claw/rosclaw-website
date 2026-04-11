import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

function createClient(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {},
        remove(name, options) {},
      },
    }
  )
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string[] } }
) {
  try {
    const supabase = createClient(req)
    const fullPath = params.id.join("/")

    // Try to find by ID first
    let { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("id", fullPath)
      .single()

    // If not found by ID, try by name
    if (error || !data) {
      const result = await supabase
        .from("skills")
        .select("*")
        .eq("name", fullPath)
        .single()
      data = result.data
      error = result.error
    }

    if (error || !data) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      )
    }

    // Only return approved skills (unless admin or owner)
    if (data.status !== "approved") {
      const { data: { session } } = await supabase.auth.getSession()
      const apiKey = req.headers.get("x-api-key")

      const isAdmin = apiKey === process.env.ADMIN_API_KEY
      const isOwner = session?.user?.id === data.author_user_id

      if (!isAdmin && !isOwner) {
        return NextResponse.json(
          { error: "Skill not found" },
          { status: 404 }
        )
      }
    }

    const skill = {
      id: data.id,
      name: data.name,
      displayName: data.display_name,
      description: data.description,
      longDescription: data.long_description,
      category: data.category,
      version: data.version,
      authorName: data.author_name,
      authorUrl: data.author_url,
      githubRepoUrl: data.github_repo_url,
      downloadsCount: data.downloads_count,
      rating: data.rating,
      reviewCount: data.review_count,
      status: data.status,
      robotTypes: data.robot_types || [],
      tags: data.tags || [],
      compatibleRobots: data.compatible_robots || [],
      dependencies: data.dependencies || [],
      installCommand: data.install_command,
      iconUrl: data.icon_url,
    }

    return NextResponse.json(skill)
  } catch (err: any) {
    console.error("Skill API error:", err.message)
    return NextResponse.json(
      { error: "Failed to fetch skill" },
      { status: 500 }
    )
  }
}
