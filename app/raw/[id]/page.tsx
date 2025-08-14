"use client"

import { useEffect, useState } from "react"

export default function RawScriptPage({ params }: { params: { id: string } }) {
  const [scriptContent, setScriptContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

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

    const checkAuthAndLoadScript = () => {
      try {
        const projects = JSON.parse(localStorage.getItem("userProjects") || "[]")
        const project = projects.find((p: any) => p.id === params.id)

        if (!project) {
          setScriptContent(`-- Script not found
game.Players.LocalPlayer:Kick("Script not found or has been removed")`)
          setLoading(false)
          return
        }

        if (project.type === "free-for-all") {
          // Free for all - serve the actual script content
          setScriptContent(project.script)
        } else if (project.type === "user-management") {
          const authScript = `
-- LuaGuard Authorization Check
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local userId = tostring(player.UserId)

-- Whitelisted users
local whitelisted = {${project.whitelisted.map((id: string) => `"${id}"`).join(", ")}}
-- Blacklisted users  
local blacklisted = {${project.blacklisted.map((id: string) => `"${id}"`).join(", ")}}

-- Check if user is blacklisted
for _, id in pairs(blacklisted) do
    if userId == id then
        player:Kick("You are blacklisted")
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
    player:Kick("You are not whitelisted")
    return
end

-- User is authorized, execute the actual script
${project.script}`
          setScriptContent(authScript)
        }
      } catch (error) {
        console.error("Error loading script:", error)
        setScriptContent(`-- Error loading script
game.Players.LocalPlayer:Kick("Error loading script")`)
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
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fb923c",
        }}
      >
        Loading script...
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "black", padding: "1rem" }}>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          fontFamily: "monospace",
          fontSize: "0.875rem",
          color: "#fdba74",
          backgroundColor: "black",
          border: "1px solid #fb923c",
          borderRadius: "4px",
          padding: "1rem",
        }}
      >
        {scriptContent}
      </pre>
    </div>
  )
}
