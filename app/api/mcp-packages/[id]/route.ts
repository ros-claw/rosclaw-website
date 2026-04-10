import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

// Helper to create Supabase client from request cookies
function createClient(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          // Not setting cookies in API route
        },
        remove(name, options) {
          // Not removing cookies in API route
        },
      },
    }
  )
}

// GET /api/mcp-packages/[id] - Get a single package by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(req)
    const { id } = params

    // Try to find by ID first, then by name
    let query = supabase
      .from("mcp_packages")
      .select("*")
      .eq("id", id)
      .single()

    let { data, error } = await query

    // If not found by ID, try by name
    if (error || !data) {
      const { data: dataByName, error: errorByName } = await supabase
        .from("mcp_packages")
        .select("*")
        .eq("name", id)
        .single()

      data = dataByName
      error = errorByName
    }

    if (error || !data) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      )
    }

    // Only return approved packages (unless admin or owner)
    if (data.status !== "approved") {
      // Check if user is admin or owner
      const { data: { session } } = await supabase.auth.getSession()
      const apiKey = req.headers.get("x-api-key")

      const isAdmin = apiKey === process.env.ADMIN_API_KEY
      const isOwner = session?.user?.id === data.author_user_id

      if (!isAdmin && !isOwner) {
        return NextResponse.json(
          { error: "Package not found" },
          { status: 404 }
        )
      }
    }

    const pkg = {
      id: data.id,
      name: data.name,
      description: data.description,
      longDescription: data.long_description,
      authorName: data.author_name,
      author_user_id: data.author_user_id,
      githubRepoUrl: data.github_repo_url,
      verified: data.is_verified,
      category: data.category,
      robotType: data.robot_type,
      version: data.version,
      downloadsCount: data.downloads_count,
      rating: data.rating,
      tags: data.tags || [],
      tools: data.tools || [],
      status: data.status,
    }

    return NextResponse.json(pkg)
  } catch (err: any) {
    console.error("MCP Package API error:", err.message)
    return NextResponse.json(
      { error: "Failed to fetch package" },
      { status: 500 }
    )
  }
}
