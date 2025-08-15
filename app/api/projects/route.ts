import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

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
    const projects = await request.json()
    await saveStorageData("projects.json", projects)

    return NextResponse.json({
      success: true,
      message: "Projects synced successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error syncing projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
