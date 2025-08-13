import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const scriptId = params.id

    // Since we can't access localStorage on the server, we'll create a comprehensive script
    // that handles authorization and serves the actual content
    const scriptContent = `-- Protected by LuaGuard
-- Script ID: ${scriptId}

local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")
local player = Players.LocalPlayer

-- Get user ID for authorization
local userId = tostring(player.UserId)

-- Fetch project data and authorization from the main site
local success, result = pcall(function()
    local response = HttpService:GetAsync("https://luaguardsme.vercel.app/api/project/" .. scriptId)
    return HttpService:JSONDecode(response)
end)

if not success then
    player:Kick("Failed to verify authorization")
    return
end

local projectData = result

-- Check authorization based on project type
if projectData.type == "User Management" then
    local isWhitelisted = false
    local isBlacklisted = false
    
    -- Check whitelist
    for _, whitelistedId in pairs(projectData.whitelisted or {}) do
        if tostring(whitelistedId) == userId then
            isWhitelisted = true
            break
        end
    end
    
    -- Check blacklist
    for _, blacklistedId in pairs(projectData.blacklisted or {}) do
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

-- If we get here, user is authorized - execute the actual script
print("LuaGuard: Authorization successful!")
print("Script ID: " .. scriptId)

-- Load and execute the actual user script
local actualScript = projectData.script or ""
if actualScript ~= "" then
    local scriptFunc, err = loadstring(actualScript)
    if scriptFunc then
        scriptFunc()
    else
        warn("LuaGuard: Script compilation error - " .. tostring(err))
    end
else
    warn("LuaGuard: No script content found")
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
