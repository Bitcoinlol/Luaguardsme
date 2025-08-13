import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const scriptId = params.id

    // Create a script that will work with the frontend localStorage data
    const scriptContent = `-- Protected by LuaGuard
-- Script ID: ${scriptId}

local Players = game:GetService("Players")
local player = Players.LocalPlayer
local userId = tostring(player.UserId)

print("LuaGuard: Checking authorization for user " .. userId)

-- For demo purposes, we'll create a simple authorization system
-- In production, this would fetch real project data from your database

-- Demo project data - replace this with actual database lookup
local projectData = {
    type = "Free for All", -- Change this to "User Management" for whitelist/blacklist
    script = [[
        -- Your uploaded script content goes here
        print("Hello from LuaGuard protected script!")
        print("User ID: " .. tostring(game.Players.LocalPlayer.UserId))
        
        -- Add your actual script content here
    ]],
    whitelisted = {}, -- Add user IDs here for whitelist
    blacklisted = {}  -- Add user IDs here for blacklist
}

-- Authorization logic
if projectData.type == "User Management" then
    local isWhitelisted = false
    local isBlacklisted = false
    
    -- Check whitelist
    for _, whitelistedId in pairs(projectData.whitelisted) do
        if tostring(whitelistedId) == userId then
            isWhitelisted = true
            break
        end
    end
    
    -- Check blacklist
    for _, blacklistedId in pairs(projectData.blacklisted) do
        if tostring(blacklistedId) == userId then
            isBlacklisted = true
            break
        end
    end
    
    if isBlacklisted then
        player:Kick("You are blacklisted!")
        return
    end
    
    if not isWhitelisted then
        player:Kick("You are not whitelisted!")
        return
    end
end

-- If we get here, user is authorized
print("LuaGuard: Authorization successful!")
print("Executing protected script...")

-- Execute the actual script
local scriptFunc, err = loadstring(projectData.script)
if scriptFunc then
    scriptFunc()
else
    warn("LuaGuard: Script error - " .. tostring(err))
end
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
