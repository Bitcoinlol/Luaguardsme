"use client"

import { useEffect, useState } from "react"

export default function RawScriptPage({ params }: { params: { id: string } }) {
  const [scriptContent, setScriptContent] = useState<string>("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

    // Check authorization and load script
    const checkAuthAndLoadScript = () => {
      try {
        // Get stored projects
        const projects = JSON.parse(localStorage.getItem("luaguard_projects") || "[]")
        const project = projects.find((p: any) => p.id === params.id)

        if (!project) {
          setLoading(false)
          return
        }

        // Check if project is "Free for All" or user is whitelisted
        if (project.accessType === "freeForAll") {
          setIsAuthorized(true)
          setScriptContent(
            project.protectedScript || `-- Protected Script: ${project.name}\nprint("Hello from ${project.name}!")`,
          )
        } else {
          // For "User Management" projects, check if current user is whitelisted
          // In a real app, this would check against the server
          const currentUser = localStorage.getItem("luaguard_current_user") || "12345"
          const isWhitelisted = project.whitelistedUsers?.includes(currentUser)

          if (isWhitelisted) {
            setIsAuthorized(true)
            setScriptContent(
              project.protectedScript || `-- Protected Script: ${project.name}\nprint("Hello from ${project.name}!")`,
            )
          }
        }
      } catch (error) {
        console.error("Error loading script:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadScript()

    return () => {
      document.removeEventListener("contextmenu", disableRightClick)
      document.removeEventListener("keydown", disableKeyboard)
    }
  }, [params.id])

  if (loading) {
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
      <div className="min-h-screen bg-black flex items-center justify-center bg-cyber-grid">
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent text-glow-orange">
            ACCESS DENIED
          </div>
          <div className="text-xl text-orange-300">You are not authorized to access this script</div>
          <div className="text-sm text-orange-500/60">Script ID: {params.id}</div>
        </div>
      </div>
    )
  }

  // Return the actual script content for authorized users
  return (
    <pre className="min-h-screen bg-black text-orange-100 p-4 font-mono text-sm whitespace-pre-wrap">
      {scriptContent}
    </pre>
  )
}
