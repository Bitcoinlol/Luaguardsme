"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RawScriptPage({ params }: { params: { id: string } }) {
  const [scriptContent, setScriptContent] = useState<string>("")
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [showCode, setShowCode] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Disable right-click and inspect element
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

    const handleBeforeUnload = () => {
      setShowCode(false)
      setApiKey("")
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    const loadProject = () => {
      try {
        const projects = JSON.parse(localStorage.getItem("userProjects") || "[]")
        const foundProject = projects.find((p: any) => p.id === params.id)

        if (!foundProject) {
          setLoading(false)
          return
        }

        setProject(foundProject)

        if (foundProject.type === "free-for-all") {
          setScriptContent(foundProject.script)
        } else if (foundProject.type === "user-management") {
          const kickScript = `
-- LuaGuard Protection System
local Players = game:GetService("Players")
local player = Players.LocalPlayer

-- Get user ID
local userId = tostring(player.UserId)

-- Check whitelist/blacklist
local whitelisted = {${foundProject.whitelisted.map((id: string) => `"${id}"`).join(", ")}}
local blacklisted = {${foundProject.blacklisted.map((id: string) => `"${id}"`).join(", ")}}

-- Check if user is blacklisted
for _, id in pairs(blacklisted) do
    if userId == id then
        player:Kick("You are blacklisted from this script!")
        return
    end
end

-- Check if user is whitelisted
local isWhitelisted = false
for _, id in pairs(whitelisted) do
    if userId == id then
        isWhitelisted = true
        break
    end
end

if not isWhitelisted then
    player:Kick("You are not whitelisted for this script!")
    return
end

-- If authorized, run the actual script
${foundProject.script}
`
          setScriptContent(kickScript)
        }
      } catch (error) {
        console.error("Error loading script:", error)
      } finally {
        setLoading(false)
      }
    }

    setTimeout(loadProject, 100)

    return () => {
      document.removeEventListener("contextmenu", disableRightClick)
      document.removeEventListener("keydown", disableKeyboard)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [params.id, mounted])

  const handleApiKeySubmit = () => {
    if (!project || !apiKey.trim()) return

    if (apiKey === project.ownerKey) {
      setIsAnimating(true)
      setTimeout(() => {
        setShowCode(true)
        setIsAnimating(false)
      }, 500)
    } else {
      // Wrong key - show error briefly
      setApiKey("")
      const input = document.getElementById("api-key-input") as HTMLInputElement
      if (input) {
        input.placeholder = "Invalid API key!"
        setTimeout(() => {
          input.placeholder = "Enter your API key"
        }, 2000)
      }
    }
  }

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

  if (!project) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            SCRIPT NOT FOUND
          </div>
          <div className="text-xl text-orange-300">The requested script does not exist</div>
          <div className="text-sm text-orange-500/60">Script ID: {params.id}</div>
        </div>
      </div>
    )
  }

  if (showCode) {
    return (
      <pre className="min-h-screen bg-black text-orange-100 p-4 font-mono text-sm whitespace-pre-wrap">
        {scriptContent}
      </pre>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-500 ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="min-h-screen flex items-center justify-center">
          <div
            className={`text-center space-y-6 transition-all duration-500 ${
              isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <div className="text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              ACCESS DENIED
            </div>
            <div className="text-xl text-orange-300">You are not authorized to access this script</div>
            <div className="text-sm text-orange-500/60 mb-8">Script ID: {params.id}</div>

            <div className="max-w-md mx-auto space-y-4">
              <div className="text-orange-400 font-semibold">Script Owner Access</div>
              <Input
                id="api-key-input"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleApiKeySubmit()}
                className="bg-black border-orange-500 text-orange-400 placeholder-orange-500/50"
              />
              <Button
                onClick={handleApiKeySubmit}
                className="w-full bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
              >
                View Script
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "none" }}>
        <pre>{scriptContent}</pre>
      </div>
    </div>
  )
}
