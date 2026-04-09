import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

// GET /api/mcp-packages - List all approved packages
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

// POST /api/mcp-packages - Create a new MCP package
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseServer()
    const body = await req.json()

    // Validate required fields
    const required = ["name", "description", "github_repo_url", "author_name"]
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check for API key authentication (for external integrations)
    const apiKey = req.headers.get("x-api-key")
    let userId = null

    if (apiKey) {
      // Validate API key against environment variable
      if (apiKey !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
      }
      // For API key auth, auto-approve the package
      body.status = "approved"
    } else {
      // Check user authentication via session/cookie
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }
      userId = session.user.id
      // For regular users, set status to pending
      body.status = "pending"
    }

    // Check if package name already exists
    const { data: existing } = await supabase
      .from("mcp_packages")
      .select("name")
      .eq("name", body.name)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "Package with this name already exists" },
        { status: 409 }
      )
    }

    // Insert new package
    const { data, error } = await supabase
      .from("mcp_packages")
      .insert({
        name: body.name,
        description: body.description,
        long_description: body.long_description,
        category: body.category,
        version: body.version || "1.0.0",
        author_user_id: userId,
        author_name: body.author_name,
        github_repo_url: body.github_repo_url,
        robot_type: body.robot_type,
        tags: body.tags || [],
        tools: body.tools || [],
        status: body.status,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: "Failed to create package" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status,
      message: "Package created successfully",
    }, { status: 201 })

  } catch (err: any) {
    console.error("MCP Packages POST error:", err.message)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/mcp-packages?id=xxx - Delete a package
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Package ID required" },
        { status: 400 }
      )
    }

    const supabase = getSupabaseServer()

    // Check API key or user authentication
    const apiKey = req.headers.get("x-api-key")
    let userId = null

    if (apiKey && apiKey === process.env.ADMIN_API_KEY) {
      // Admin can delete any package
    } else {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }
      userId = session.user.id

      // Check if user owns this package
      const { data: pkg } = await supabase
        .from("mcp_packages")
        .select("author_user_id")
        .eq("id", id)
        .single()

      if (!pkg || pkg.author_user_id !== userId) {
        return NextResponse.json(
          { error: "You can only delete your own packages" },
          { status: 403 }
        )
      }
    }

    const { error } = await supabase
      .from("mcp_packages")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Delete error:", error)
      return NextResponse.json(
        { error: "Failed to delete package" },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "Package deleted successfully" })

  } catch (err: any) {
    console.error("MCP Packages DELETE error:", err.message)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
