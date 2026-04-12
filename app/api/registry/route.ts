import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Mock package database (will be replaced with real database queries)
const MOCK_PACKAGES: Record<string, {
  status: string;
  type: string;
  name: string;
  git_url: string;
  description: string;
  entry_point: string;
  version: string;
  author: string;
  dependencies: string[];
}> = {
  "ros-claw/realsense-ur5-mcp": {
    status: "success",
    type: "mcp_server",
    name: "ros-claw/realsense-ur5-mcp",
    git_url: "https://github.com/ros-claw/realsense-ur5-mcp.git",
    description: "RealSense and UR5e integration for ROSClaw",
    entry_point: "ur5_mcp_server.py",
    version: "1.0.0",
    author: "ROSClaw Team",
    dependencies: ["pyrealsense2", "ur-rtde"],
  },
  "ros-claw/ur-ros2-mcp": {
    status: "success",
    type: "mcp_server",
    name: "ros-claw/ur-ros2-mcp",
    git_url: "https://github.com/ros-claw/ur-ros2-mcp.git",
    description: "Universal Robots ROS2 driver MCP server",
    entry_point: "ur_ros2_mcp_server.py",
    version: "1.2.0",
    author: "ROSClaw Team",
    dependencies: ["ur-rtde", "rclpy"],
  },
  "ros-claw/librealsense-mcp": {
    status: "success",
    type: "mcp_server",
    name: "ros-claw/librealsense-mcp",
    git_url: "https://github.com/ros-claw/librealsense-mcp.git",
    description: "Intel RealSense depth camera MCP server",
    entry_point: "realsense_mcp_server.py",
    version: "0.9.5",
    author: "ROSClaw Team",
    dependencies: ["pyrealsense2", "numpy"],
  },
  "ros-claw/g1-mcp": {
    status: "success",
    type: "mcp_server",
    name: "ros-claw/g1-mcp",
    git_url: "https://github.com/ros-claw/g1-mcp.git",
    description: "Unitree G1 humanoid robot MCP server",
    entry_point: "g1_mcp_server.py",
    version: "0.1.0",
    author: "ROSClaw Team",
    dependencies: ["unitree-sdk"],
  },
};

// Helper to create Supabase client
function createClient(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {},
        remove(name, options) {},
      },
    }
  );
}

// GET /api/registry?pkg=<package_name>
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pkgName = searchParams.get("pkg");

    if (!pkgName) {
      return NextResponse.json(
        { status: "error", message: "Missing 'pkg' query parameter" },
        { status: 400 }
      );
    }

    // Normalize package name (handle both "owner/repo" and "owner-repo" formats)
    const normalizedName = pkgName.includes("/") ? pkgName : pkgName.replace(/-/g, "/");

    // Try mock database first (for testing)
    if (MOCK_PACKAGES[pkgName] || MOCK_PACKAGES[normalizedName]) {
      const pkg = MOCK_PACKAGES[pkgName] || MOCK_PACKAGES[normalizedName];
      return NextResponse.json(pkg, {
        headers: {
          "Cache-Control": "public, max-age=60", // Short cache for registry
        },
      });
    }

    // Try Supabase database
    try {
      const supabase = createClient(req);

      // Try exact match first
      let { data: pkg, error } = await supabase
        .from("mcp_packages")
        .select("*")
        .eq("name", pkgName)
        .eq("status", "approved")
        .single();

      // If not found, try normalized name
      if (!pkg && pkgName !== normalizedName) {
        const result = await supabase
          .from("mcp_packages")
          .select("*")
          .eq("name", normalizedName)
          .eq("status", "approved")
          .single();
        pkg = result.data;
        error = result.error;
      }

      if (pkg && !error) {
        return NextResponse.json({
          status: "success",
          type: "mcp_server",
          name: pkg.name,
          git_url: pkg.github_repo_url,
          description: pkg.description,
          entry_point: pkg.entry_point || "server.py",
          version: pkg.version || "1.0.0",
          author: pkg.author_name,
          dependencies: pkg.dependencies || [],
        }, {
          headers: {
            "Cache-Control": "public, max-age=60",
          },
        });
      }
    } catch (dbError) {
      console.error("Database query error:", dbError);
      // Fall through to 404
    }

    // Package not found
    return NextResponse.json(
      {
        status: "error",
        message: "Package not found in ROSClaw Hub.",
        suggestions: [
          "Check the package name spelling",
          "Browse available packages at https://rosclaw.io/mcp-hub",
          "Submit your package at https://rosclaw.io/mcp-hub/publish",
        ],
      },
      { status: 404 }
    );

  } catch (err: any) {
    console.error("Registry API error:", err.message);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

// HEAD /api/registry?pkg=<package_name> - For checking existence without full response
export async function HEAD(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pkgName = searchParams.get("pkg");

    if (!pkgName) {
      return new NextResponse(null, { status: 400 });
    }

    const normalizedName = pkgName.includes("/") ? pkgName : pkgName.replace(/-/g, "/");

    // Check mock database
    if (MOCK_PACKAGES[pkgName] || MOCK_PACKAGES[normalizedName]) {
      return new NextResponse(null, {
        status: 200,
        headers: {
          "X-Package-Exists": "true",
        },
      });
    }

    // Check Supabase
    try {
      const supabase = createClient(req);
      const { data: pkg } = await supabase
        .from("mcp_packages")
        .select("id")
        .eq("name", pkgName)
        .eq("status", "approved")
        .single();

      if (pkg) {
        return new NextResponse(null, {
          status: 200,
          headers: {
            "X-Package-Exists": "true",
          },
        });
      }
    } catch {
      // Fall through to 404
    }

    return new NextResponse(null, { status: 404 });

  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
