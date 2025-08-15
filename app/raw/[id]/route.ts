import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

async function getStorageData(filename: string) {
  try {
    const filePath = path.join(process.cwd(), "data", filename)
    const data = await fs.readFile(filePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    return filename === "kicked-users.json" ? [] : {}
  }
}

async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")
    const scriptId = params.id

    if (!userId) {
      return new NextResponse(
        `-- LuaGuard Protection System\ngame.Players.LocalPlayer:Kick("Invalid user identification!")`,
        {
          status: 400,
          headers: { "Content-Type": "text/plain" },
        },
      )
    }

    await ensureDataDirectory()

    const kickedUsers = await getStorageData("kicked-users.json")
    const kickedUser = kickedUsers.find((user: any) => user.userId === userId)

    if (kickedUser) {
      return new NextResponse(
        `-- LuaGuard Protection System\ngame.Players.LocalPlayer:Kick("You have been kicked: ${kickedUser.reason || "No reason provided"}")`,
        {
          status: 200,
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        },
      )
    }

    const projects = await getStorageData("projects.json")
    const project = projects[scriptId]

    if (!project) {
      return new NextResponse(
        `-- LuaGuard Protection System\ngame.Players.LocalPlayer:Kick("Script not found or has been removed!")`,
        {
          status: 404,
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        },
      )
    }

    if (project.type === "free-for-all") {
      return new NextResponse(project.script, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-LuaGuard-Protected": "true",
        },
      })
    } else if (project.type === "user-management") {
      // Check if user is blacklisted first
      if (project.blacklisted?.includes(userId)) {
        return new NextResponse(
          `-- LuaGuard Protection System\ngame.Players.LocalPlayer:Kick("You are blacklisted from this script!")`,
          {
            status: 200,
            headers: {
              "Content-Type": "text/plain",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          },
        )
      }

      // Check if user is whitelisted
      if (project.whitelisted?.includes(userId)) {
        return new NextResponse(project.script, {
          status: 200,
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-LuaGuard-Protected": "true",
          },
        })
      } else {
        return new NextResponse(
          `-- LuaGuard Protection System\ngame.Players.LocalPlayer:Kick("You are not whitelisted for this script!")`,
          {
            status: 200,
            headers: {
              "Content-Type": "text/plain",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          },
        )
      }
    }

    // Default unauthorized response
    return new NextResponse(
      `-- LuaGuard Protection System\ngame.Players.LocalPlayer:Kick("Access denied - Invalid project type!")`,
      {
        status: 403,
        headers: { "Content-Type": "text/plain" },
      },
    )
  } catch (error) {
    console.error("Error serving script:", error)
    return new NextResponse(
      `-- LuaGuard Protection System\ngame.Players.LocalPlayer:Kick("Server error - Please try again later!")`,
      {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      },
    )
  }
}
