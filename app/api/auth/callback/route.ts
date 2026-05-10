import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.rosclaw.io"

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url)
  const code = requestUrl.searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
  }

  // Create response object to set cookies
  const response = NextResponse.redirect(`${requestUrl.origin}/profile`)

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

    const user = data?.user
    if (!user || !user.email) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=no_user`)
    }

    // Upsert profile
    if (user.user_metadata) {
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

    // Exchange email for Wiki API Key
    try {
      const exchangeRes = await fetch(`${API_BASE}/wiki/v1/auth/exchange`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          provider: user.app_metadata?.provider || "",
        }),
      })

      if (exchangeRes.ok) {
        const wikiData = await exchangeRes.json()
        if (wikiData.api_key) {
          // Set API key in cookie for client to pick up
          response.cookies.set({
            name: "rosclaw_api_key",
            value: wikiData.api_key,
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365, // 1 year
          })
        }
      }
    } catch (wikiErr) {
      console.error("Wiki API exchange error:", wikiErr)
      // Continue even if Wiki API fails - user can retry later
    }
  } catch (err) {
    console.error("Auth callback failed:", err)
    return NextResponse.redirect(`${requestUrl.origin}/login?error=callback_failed`)
  }

  return response
}
