import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const scriptId = params.id
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    // Get projects from localStorage simulation (in real app this would be from database)
    // For now, we'll simulate getting the data that would be stored

    // Mock check - in real implementation, you'd fetch from database
    // We'll return different responses based on the script ID pattern for testing

    // Kick script for unauthorized access
    const kickScript = `
local message = "This link is already linked to another users account"
local player = game:GetService("Players").LocalPlayer
if player then
    player:Kick(message)
end
`

    const notWhitelistedScript = `
local player = game:GetService("Players").LocalPlayer
if player then
    player:Kick("You are not whitelisted")
end
`

    const blacklistedScript = `
local player = game:GetService("Players").LocalPlayer
if player then
    player:Kick("You are blacklisted")
end
`

    // Function to wrap code with loading animation like the Express server
    function wrapCodeWithConsoleOutput(code: string) {
      return `
-- Loading bar for console
for i = 1, 10 do
    print("Loading" .. string.rep(".", i))
    wait(0.1)
end
print("Loaded successfully")

-- The user's original script
do
${code}
end
`
    }

    // Since we don't have real database access in this demo, we'll simulate the logic
    // In a real implementation, you would:
    // 1. Look up the script by ID in your database
    // 2. Check if it exists and get its configuration
    // 3. Apply the authorization logic based on the script's settings

    // For demo purposes, let's create a mock script response
    const mockScript = `
-- Your Protected LuaGuard Script
print("Hello from LuaGuard!")
print("Script ID: ${scriptId}")
print("User ID: ${userId || "Unknown"}")

-- Example script content
local player = game.Players.LocalPlayer
print("Welcome " .. player.Name .. "!")

-- Your actual script logic would go here
`

    // Simulate different responses based on script ID for testing
    if (scriptId.includes("blacklisted")) {
      return new NextResponse(blacklistedScript, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    if (scriptId.includes("notwhitelisted")) {
      return new NextResponse(notWhitelistedScript, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }

    // For most cases, return the wrapped script (simulating "free for all" or authorized access)
    return new NextResponse(wrapCodeWithConsoleOutput(mockScript), {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Error serving script:", error)
    return new NextResponse(
      `-- Error loading script
local player = game:GetService("Players").LocalPlayer
if player then
    player:Kick("Error loading script")
end`,
      {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        },
      },
    )
  }
}
