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
    const fullPath = params.id.join("/")

    // Convert dash format to slash format (e.g., "owner-repo" -> "owner/repo")
    const slashPath = fullPath.replace(/^([^-]+)-(.+)$/, "$1/$2")

    // Try to find by ID first
    let { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("id", fullPath)
      .single()

    // If not found by ID, try by name (dash format)
    if (error || !data) {
      const result = await supabase
        .from("skills")
        .select("*")
        .eq("name", fullPath)
        .single()
      data = result.data
      error = result.error
    }

    // If still not found, try by name with slash format
    if ((!data && slashPath !== fullPath) || (error && slashPath !== fullPath)) {
      const result = await supabase
        .from("skills")
        .select("*")
        .eq("name", slashPath)
        .single()
      if (result.data) {
        data = result.data
        error = null
      }
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
      readmeContent: data.readme_content,
      category: data.category,
      version: data.version,
      authorName: data.author_name,
      authorUrl: data.author_url,
      githubRepoUrl: data.github_repo_url,
      viewsCount: data.views_count || 0,
      githubStars: data.github_stars || 0,
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

// POST /api/skills/[...id]?action=view - Increment view count
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

    // Convert dash format to slash format
    const slashPath = fullPath.replace(/^([^-]+)-(.+)$/, "$1/$2")

    // Use admin client to bypass RLS
    const adminClient = createAdminClient()

    // Try to find skill by name (both formats)
    let result = await adminClient
      .from("skills")
      .select("id, views_count")
      .eq("name", fullPath)
      .single()

    if (!result.data && slashPath !== fullPath) {
      result = await adminClient
        .from("skills")
        .select("id, views_count")
        .eq("name", slashPath)
        .single()
    }

    if (!result.data) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 })
    }

    // Increment views_count
    const { error } = await adminClient
      .from("skills")
      .update({ views_count: (result.data.views_count || 0) + 1 })
      .eq("id", result.data.id)

    if (error) {
      console.error("Failed to increment views:", error)
      return NextResponse.json({ error: "Failed to increment views" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Skill POST error:", err.message)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/skills/[...id] - Update skill (for sync)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string[] } }
) {
  try {
    const fullPath = params.id.join("/")
    const body = await req.json()

    // Check API key
    const apiKey = req.headers.get("x-api-key")
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: "Invalid or missing API key" },
        { status: 401 }
      )
    }

    const adminClient = createAdminClient()

    // Find skill by ID or name
    let { data: existing } = await adminClient
      .from("skills")
      .select("id")
      .eq("id", fullPath)
      .single()

    if (!existing) {
      const result = await adminClient
        .from("skills")
        .select("id")
        .eq("name", fullPath)
        .single()
      existing = result.data
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      )
    }

    // Build update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // Only update provided fields
    if (body.description !== undefined) updateData.description = body.description
    if (body.long_description !== undefined) updateData.long_description = body.long_description
    if (body.readme_content !== undefined) updateData.readme_content = body.readme_content
    if (body.display_name !== undefined) updateData.display_name = body.display_name
    if (body.github_stars !== undefined) updateData.github_stars = body.github_stars
    if (body.category !== undefined) updateData.category = body.category
    if (body.robot_types !== undefined) updateData.robot_types = body.robot_types
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.version !== undefined) updateData.version = body.version
    if (body.status !== undefined) updateData.status = body.status

    const { data, error } = await adminClient
      .from("skills")
      .update(updateData)
      .eq("id", existing.id)
      .select()
      .single()

    if (error) {
      console.error("Update error:", error)
      return NextResponse.json(
        { error: "Failed to update skill" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      id: data.id,
      name: data.name,
      message: "Skill updated successfully",
      updated_fields: Object.keys(updateData),
    })

  } catch (err: any) {
    console.error("Skill PUT error:", err.message)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/skills/[...id] - Delete skill
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string[] } }
) {
  try {
    const fullPath = params.id.join("/")

    // Check API key
    const apiKey = req.headers.get("x-api-key")
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: "Invalid or missing API key" },
        { status: 401 }
      )
    }

    const adminClient = createAdminClient()

    // Find skill by ID or name
    let { data: existing } = await adminClient
      .from("skills")
      .select("id")
      .eq("id", fullPath)
      .single()

    if (!existing) {
      const result = await adminClient
        .from("skills")
        .select("id")
        .eq("name", fullPath)
        .single()
      existing = result.data
    }

    if (!existing) {
      return NextResponse.json(
        { error: "Skill not found" },
        { status: 404 }
      )
    }

    // Delete the skill
    const { error } = await adminClient
      .from("skills")
      .delete()
      .eq("id", existing.id)

    if (error) {
      console.error("Delete error:", error)
      return NextResponse.json(
        { error: "Failed to delete skill" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Skill deleted successfully",
      id: existing.id,
    })
  } catch (err: any) {
    console.error("Skill DELETE error:", err.message)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
