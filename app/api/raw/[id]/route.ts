import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // In a real implementation, you'd fetch from a database
    // For now, we'll return a simple response that indicates the script should be fetched client-side

    const scriptContent = `-- Protected by LuaGuard
-- This is a placeholder. In production, this would fetch the actual script from your database.
-- Script ID: ${params.id}

print("LuaGuard: Script loaded successfully!")
print("Script ID: ${params.id}")

-- Your actual script content would be here
-- This is just a test to verify the API route works
`

    return new NextResponse(scriptContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    return new NextResponse("-- Error loading script", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    })
  }
}
