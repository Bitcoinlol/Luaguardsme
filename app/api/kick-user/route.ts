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

async function saveStorageData(filename: string, data: any) {
  const dataDir = path.join(process.cwd(), "data")
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }

  const filePath = path.join(dataDir, filename)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const { userId, reason, adminKey } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const validAdminKey = process.env.ADMIN_KEY || "Ownerspecialkidmelol::founderkey=yes"
    if (adminKey !== validAdminKey) {
      return NextResponse.json({ error: "Invalid admin key" }, { status: 403 })
    }

    const kickedUsers = await getStorageData("kicked-users.json")

    // Remove user if already kicked, then add new kick entry
    const filteredUsers = kickedUsers.filter((user: any) => user.userId !== userId)

    const kickData = {
      userId,
      reason: reason || "No reason provided",
      kickedAt: new Date().toISOString(),
      kickedBy: "admin",
    }

    filteredUsers.push(kickData)
    await saveStorageData("kicked-users.json", filteredUsers)

    console.log(`[LuaGuard] User ${userId} has been kicked and stored persistently.`, kickData)

    return NextResponse.json({
      success: true,
      message: `User ${userId} has been kicked successfully`,
      data: kickData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error kicking user:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const kickedUsers = await getStorageData("kicked-users.json")
    const kickedUser = kickedUsers.find((user: any) => user.userId === userId)
    const isKicked = !!kickedUser

    return NextResponse.json({
      userId,
      isKicked,
      kickData: kickedUser || null,
      message: isKicked ? "User is kicked" : "User is not kicked",
    })
  } catch (error) {
    console.error("Error checking kick status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, adminKey } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const validAdminKey = process.env.ADMIN_KEY || "Ownerspecialkidmelol::founderkey=yes"
    if (adminKey !== validAdminKey) {
      return NextResponse.json({ error: "Invalid admin key" }, { status: 403 })
    }

    const kickedUsers = await getStorageData("kicked-users.json")
    const filteredUsers = kickedUsers.filter((user: any) => user.userId !== userId)

    await saveStorageData("kicked-users.json", filteredUsers)

    return NextResponse.json({
      success: true,
      message: `User ${userId} has been unkicked successfully`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error unkicking user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
