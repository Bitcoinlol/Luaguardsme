import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    // For demo purposes, we'll simulate Roblox API responses
    // In a real implementation, you'd make actual API calls to Roblox
    const mockUsers = [
      {
        id: 1,
        name: username,
        displayName: username,
        description: `This is ${username}'s profile`,
        created: "2018-05-15T10:30:00.000Z",
        isBanned: false,
        externalAppDisplayName: username,
        hasVerifiedBadge: Math.random() > 0.7,
        avatarUrl: `/placeholder.svg?height=150&width=150&query=roblox+avatar+${username}`,
      },
    ]

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = mockUsers[0]

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        displayName: user.displayName,
        description: user.description,
        created: user.created,
        isBanned: user.isBanned,
        hasVerifiedBadge: user.hasVerifiedBadge,
        avatarUrl: user.avatarUrl,
      },
    })
  } catch (error) {
    console.error("Error fetching Roblox user:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}
