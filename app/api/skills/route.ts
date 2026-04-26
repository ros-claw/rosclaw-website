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

// GET /api/skills - List all approved skills
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  try {
    const supabase = createClient(req)

    let query = supabase
      .from("skills")
      .select("*")
      .eq("status", "approved")
      .order("downloads_count", { ascending: false })

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
      viewsCount: s.views_count || 0,
      githubStars: s.github_stars || 0,
      rating: s.rating,
      reviewCount: s.review_count,
      status: s.status,
      robotTypes: s.robot_types || [],
      tags: s.tags || [],
      dependencies: s.dependencies || [],
      installCommand: s.install_command,
      iconUrl: s.icon_url,
    }))

    return NextResponse.json(skills)
  } catch (err: any) {
    console.error("Skills API error:", err.message)
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}

// POST /api/skills - Create a new skill
export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(req)
    const body = await req.json()

    // Validate required fields
    const required = ["name", "display_name", "description", "author_name"]
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check for API key or session authentication
    const apiKey = req.headers.get("x-api-key")
    let userId: string | null = null
    let client = supabase

    if (apiKey) {
      // API key authentication
      if (apiKey !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
      }
      body.status = "approved"
      // Use admin client to bypass RLS for API key auth
      client = createAdminClient()
    } else {
      // Session authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }
      userId = session.user.id
      body.status = "pending"
    }

    // Check if skill name already exists
    const { data: existing } = await client
      .from("skills")
      .select("name")
      .eq("name", body.name)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "Skill with this name already exists" },
        { status: 409 }
      )
    }

    // Insert new skill
    const { data, error } = await client
      .from("skills")
      .insert({
        name: body.name,
        display_name: body.display_name,
        description: body.description,
        long_description: body.long_description,
        readme_content: body.readme_content,
        category: body.category,
        version: body.version || "1.0.0",
        author_user_id: userId,
        author_name: body.author_name,
        author_url: body.author_url,
        github_repo_url: body.github_repo_url,
        robot_types: body.robot_types || [],
        tags: body.tags || [],
        compatible_robots: body.compatible_robots || [],
        dependencies: body.dependencies || [],
        status: body.status,
        icon_url: body.icon_url,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: "Failed to create skill" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      id: data.id,
      name: data.name,
      display_name: data.display_name,
      status: data.status,
      message: "Skill created successfully",
    }, { status: 201 })

  } catch (err: any) {
    console.error("Skills POST error:", err.message)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/skills?id=xxx - Delete a skill
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Skill ID required" },
        { status: 400 }
      )
    }

    const supabase = createClient(req)

    const apiKey = req.headers.get("x-api-key")
    let userId: string | null = null

    if (apiKey) {
      // API key authentication - can delete any skill
      if (apiKey !== process.env.ADMIN_API_KEY) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
      }
    } else {
      // Session authentication - can only delete own skills
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      }
      userId = session.user.id

      const { data: skill } = await supabase
        .from("skills")
        .select("author_user_id")
        .eq("id", id)
        .single()

      if (!skill || skill.author_user_id !== userId) {
        return NextResponse.json(
          { error: "You can only delete your own skills" },
          { status: 403 }
        )
      }
    }

    // Use admin client to bypass RLS for delete operation
    const adminClient = createAdminClient()
    const { error } = await adminClient
      .from("skills")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Delete error:", error)
      return NextResponse.json(
        { error: "Failed to delete skill" },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "Skill deleted successfully" })

  } catch (err: any) {
    console.error("Skills DELETE error:", err.message)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
