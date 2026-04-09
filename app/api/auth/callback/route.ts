import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const code = requestUrl.searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
  }

  // Create response object to set cookies
  const response = NextResponse.redirect(requestUrl.origin)

  // Create Supabase client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
          })
        },
      },
    }
  )

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error("OAuth callback error:", error.message)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=exchange_failed`)
    }

    // Upsert profile if user was just created
    const user = data?.user
    if (user && user.user_metadata) {
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          username: user.user_metadata.user_name || user.user_metadata.preferred_username || user.email?.split("@")[0],
          full_name: user.user_metadata.full_name || "",
          avatar_url: user.user_metadata.avatar_url || "",
          ...(user.app_metadata.provider === "github"
            ? { github_username: user.user_metadata.user_name || "" }
            : {}),
        },
        { onConflict: "id" }
      )
      if (profileError) {
        console.error("Profile upsert error:", profileError.message)
      }
    }
  } catch (err) {
    console.error("Auth callback failed:", err)
    return NextResponse.redirect(`${requestUrl.origin}/login?error=callback_failed`)
  }

  // Return response with cookies set
  return response
}
