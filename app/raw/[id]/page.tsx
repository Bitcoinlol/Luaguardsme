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
          setLoading(false)
          return
        }

        const getUserId = () => {
          // In a real Roblox environment, this would be game.Players.LocalPlayer.UserId
          // For testing, we'll use a stored user ID or default
          return localStorage.getItem("roblox_user_id") || "12345"
        }

        const currentUserId = getUserId()

        if (project.type === "free-for-all") {
          setIsAuthorized(true)
          setScriptContent(
            project.script || `-- Protected Script: ${project.name}\nprint("Hello from ${project.name}!")`,
          )
        } else if (project.type === "user-management") {
          const isBlacklisted = project.blacklisted?.includes(currentUserId)
          if (isBlacklisted) {
            setScriptContent(`
-- LuaGuard Protection System
game.Players.LocalPlayer:Kick("You are blacklisted from this script!")
            `)
            setIsAuthorized(true) // Allow the kick script to run
            return
          }

          const isWhitelisted = project.whitelisted?.includes(currentUserId)
          if (isWhitelisted) {
            setIsAuthorized(true)
            setScriptContent(
              project.script || `-- Protected Script: ${project.name}\nprint("Hello from ${project.name}!")`,
            )
          } else {
            setScriptContent(`
-- LuaGuard Protection System
game.Players.LocalPlayer:Kick("You are not whitelisted for this script!")
            `)
            setIsAuthorized(true) // Allow the kick script to run
          }
        }
      } catch (error) {
        console.error("Error loading script:", error)
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

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            ACCESS DENIED
          </div>
          <div className="text-xl text-orange-300">You are not authorized to access this script</div>
          <div className="text-sm text-orange-500/60">Script ID: {params.id}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-orange-100 p-4">
      <pre className="font-mono text-sm whitespace-pre-wrap">{scriptContent}</pre>
    </div>
  )
}
