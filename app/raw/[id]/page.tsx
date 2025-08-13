"use client"

import { useEffect, useState } from "react"

export default function RawScriptPage({ params }: { params: { id: string } }) {
  const [scriptContent, setScriptContent] = useState<string>("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const disableRightClick = (e: MouseEvent) => e.preventDefault()
    const disableKeyboard = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "C") ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault()
      }
    }

    document.addEventListener("contextmenu", disableRightClick)
    document.addEventListener("keydown", disableKeyboard)
    document.addEventListener("selectstart", (e) => e.preventDefault())

    const checkAuthAndLoadScript = () => {
      try {
        const projects = JSON.parse(localStorage.getItem("userProjects") || "[]")
        const project = projects.find((p: any) => p.id === params.id)

        if (!project) {
          setLoading(false)
          return
        }

        const createProtectedScript = (
          originalScript: string,
          projectType: string,
          whitelisted: string[],
          blacklisted: string[],
        ) => {
          if (projectType === "free-for-all") {
            return `-- Protected by LuaGuard - Free for All
-- Project: ${project.name}

${originalScript}`
          } else {
            // User Management - add authorization checks
            const whitelistArray = whitelisted.map((id) => `"${id}"`).join(", ")
            const blacklistArray = blacklisted.map((id) => `"${id}"`).join(", ")

            return `-- Protected by LuaGuard - User Management
-- Project: ${project.name}

local Players = game:GetService("Players")
local player = Players.LocalPlayer

-- Get user ID
local userId = tostring(player.UserId)

-- Whitelist and Blacklist
local whitelist = {${whitelistArray}}
local blacklist = {${blacklistArray}}

-- Check if user is blacklisted
for _, id in pairs(blacklist) do
    if userId == id then
        player:Kick("You are blacklisted from this script!")
        return
    end
end

-- Check if user is whitelisted
local isWhitelisted = false
for _, id in pairs(whitelist) do
    if userId == id then
        isWhitelisted = true
        break
    end
end

if not isWhitelisted then
    player:Kick("You are not whitelisted for this script!")
    return
end

-- User is authorized, run the script
${originalScript}`
          }
        }

        const protectedScript = createProtectedScript(
          project.script || "-- No script content",
          project.type,
          project.whitelisted || [],
          project.blacklisted || [],
        )

        setScriptContent(protectedScript)
        setIsAuthorized(true)

        const updatedProjects = projects.map((p: any) =>
          p.id === params.id ? { ...p, executions: (p.executions || 0) + 1 } : p,
        )
        localStorage.setItem("userProjects", JSON.stringify(updatedProjects))
      } catch (error) {
        console.error("Error loading script:", error)
        setScriptContent("-- Error loading script")
        setIsAuthorized(true)
      } finally {
        setLoading(false)
      }
    }

    setTimeout(checkAuthAndLoadScript, 100)

    return () => {
      document.removeEventListener("contextmenu", disableRightClick)
      document.removeEventListener("keydown", disableKeyboard)
    }
  }, [params.id, mounted])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto"></div>
          <div className="text-orange-400">Loading script...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background script content */}
      <pre className="min-h-screen bg-black text-orange-100 p-4 font-mono text-sm whitespace-pre-wrap opacity-0">
        {scriptContent}
      </pre>

      {/* Visible overlay that shows "ACCESS DENIED" but serves actual content */}
      <div className="absolute inset-0 bg-black flex items-center justify-center pointer-events-none">
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            ACCESS DENIED
          </div>
          <div className="text-xl text-orange-300">You are not authorized to access this script</div>
          <div className="text-sm text-orange-500/60">Script ID: {params.id}</div>
        </div>
      </div>

      {/* Hidden actual script content that gets served */}
      <div className="hidden">
        <pre>{scriptContent}</pre>
      </div>
    </div>
  )
}
