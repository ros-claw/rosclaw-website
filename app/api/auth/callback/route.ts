import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const code = requestUrl.searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
  }

  try {
    const supabase = getSupabaseServer()
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

  return NextResponse.redirect(requestUrl.origin)
}
