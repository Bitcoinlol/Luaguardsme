import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id

    // Since we can't access localStorage on server, return a mock response
    // In production, this would fetch from your database
    const mockProject = {
      id: projectId,
      name: "Sample Project",
      type: "Free for All", // This would be fetched from database
      script: "print('Hello from your uploaded script!')", // This would be the actual uploaded script
      whitelisted: [], // This would be fetched from database
      blacklisted: [], // This would be fetched from database
    }

    return NextResponse.json(mockProject, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }
}
