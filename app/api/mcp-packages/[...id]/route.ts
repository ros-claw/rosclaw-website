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

// Helper to create Supabase admin client (service role - bypasses RLS)
function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get() { return undefined },
        set() {},
        remove() {},
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
    // Join the path segments back together (e.g., ['shaoxiang', 'librealsense-mcp'] -> 'shaoxiang/librealsense-mcp')
    const fullPath = params.id.join("/")

    // Try to find by ID first
    let { data, error } = await supabase
      .from("mcp_packages")
      .select("*")
      .eq("id", fullPath)
      .single()

    // If not found by ID, try by exact name
    if (error || !data) {
      const result = await supabase
        .from("mcp_packages")
        .select("*")
        .eq("name", fullPath)
        .single()
      data = result.data
      error = result.error
    }

    if (error || !data) {
      return NextResponse.json(
        { error: "Package not found" },
        { status: 404 }
      )
    }

    // Only return approved packages (unless admin or owner)
    if (data.status !== "approved") {
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
      viewsCount: data.views_count || 0,
      githubStars: data.github_stars || 0,
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

// POST /api/mcp-packages/[...id]/view - Increment view count
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string[] } }
) {
  try {
    const fullPath = params.id.join("/")
    const { searchParams } = new URL(req.url)
    const action = searchParams.get("action")

    if (action !== "view") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    // Use admin client to bypass RLS for incrementing views
    const adminClient = createAdminClient()

    // Try to find by ID first, then by name
    let result = await adminClient
      .from("mcp_packages")
      .select("id")
      .eq("id", fullPath)
      .single()

    if (!result.data) {
      result = await adminClient
        .from("mcp_packages")
        .select("id")
        .eq("name", fullPath)
        .single()
    }

    if (!result.data) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    // Increment views_count
    const { data: current } = await adminClient
      .from("mcp_packages")
      .select("views_count")
      .eq("id", result.data.id)
      .single()

    const { error } = await adminClient
      .from("mcp_packages")
      .update({ views_count: (current?.views_count || 0) + 1 })
      .eq("id", result.data.id)

    if (error) {
      console.error("Failed to increment views:", error)
      return NextResponse.json({ error: "Failed to increment views" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("MCP Package POST error:", err.message)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
