"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Shield,
  UserCheck,
  UserX,
  Plus,
  Download,
  Copy,
  Trash2,
  Settings,
  X,
  Calendar,
  LogOut,
  Coins,
} from "lucide-react"

interface Project {
  id: string
  name: string
  type: "free-for-all" | "user-management"
  script: string
  rawLink: string
  whitelisted: string[]
  blacklisted: string[]
  executions: number
  createdAt: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState({
    name: "",
    type: "free-for-all" as "free-for-all" | "user-management",
    file: null as File | null,
  })
  const [newUserId, setNewUserId] = useState("")
  const [userIdType, setUserIdType] = useState<"whitelist" | "blacklist">("whitelist")
  const [notification, setNotification] = useState("")
  const [keyExpiry, setKeyExpiry] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [stats, setStats] = useState({ whitelisted: 0, blacklisted: 0 })
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const userType = localStorage.getItem("userType")
    const currentKey = localStorage.getItem("currentKey")
    if (!userType || !currentKey) {
      router.push("/")
      return
    }

    // Load projects from localStorage
    const savedProjects = localStorage.getItem("userProjects")
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects)
      setProjects(parsedProjects)
      updateStats(parsedProjects)
    }

    // Set key expiry and time
    const storedExpiry = localStorage.getItem("keyExpiry")
    if (storedExpiry) {
      setKeyExpiry(new Date(storedExpiry).toLocaleDateString())
    }

    const updateTime = () => setCurrentTime(new Date().toLocaleString())
    updateTime()
    const timeInterval = setInterval(updateTime, 1000)

    return () => clearInterval(timeInterval)
  }, [router])

  const updateStats = (projectList: Project[]) => {
    let totalWhitelisted = 0
    let totalBlacklisted = 0

    projectList.forEach((project) => {
      totalWhitelisted += project.whitelisted.length
      totalBlacklisted += project.blacklisted.length
    })

    setStats({ whitelisted: totalWhitelisted, blacklisted: totalBlacklisted })

    // Update global stats
    const globalStats = {
      executions: projectList.reduce((sum, p) => sum + p.executions, 0),
      whitelisted: totalWhitelisted,
      blacklisted: totalBlacklisted,
    }
    localStorage.setItem("userStats", JSON.stringify(globalStats))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "text/plain") {
      setNewProject((prev) => ({ ...prev, file }))
    } else {
      showNotification("Please upload a .txt file only!")
    }
  }

  const createProject = async () => {
    if (!newProject.name.trim() || !newProject.file) {
      showNotification("Please provide a project name and upload a script file!")
      return
    }

    const scriptContent = await newProject.file.text()
    const projectId = Math.random().toString(36).substring(2, 15)
    const rawLink = `https://luaguardsme.vercel.app/raw/${projectId}`

    const project: Project = {
      id: projectId,
      name: newProject.name,
      type: newProject.type,
      script: scriptContent,
      rawLink,
      whitelisted: [],
      blacklisted: [],
      executions: 0,
      createdAt: new Date().toISOString(),
    }

    const updatedProjects = [...projects, project]
    setProjects(updatedProjects)
    localStorage.setItem("userProjects", JSON.stringify(updatedProjects))
    updateStats(updatedProjects)

    // Reset form
    setNewProject({ name: "", type: "free-for-all", file: null })
    setShowCreateModal(false)
    showNotification("Project created successfully!")
  }

  const copyLoadstring = (project: Project) => {
    const loadstring = `loadstring(game:HttpGet("${project.rawLink}"))()`
    navigator.clipboard.writeText(loadstring)
    showNotification("Loadstring copied to clipboard!")
  }

  const downloadLoader = (project: Project) => {
    const loaderContent = `-- Your Protected Loader\n-- Project: ${project.name}\n\nloadstring(game:HttpGet("${project.rawLink}"))()`
    const blob = new Blob([loaderContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${project.name}_loader.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId)
    setProjects(updatedProjects)
    localStorage.setItem("userProjects", JSON.stringify(updatedProjects))
    updateStats(updatedProjects)
    showNotification("Project deleted successfully!")
  }

  const addUserId = () => {
    if (!newUserId.trim() || !selectedProject) return

    const userId = newUserId.trim()
    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProject.id) {
        if (userIdType === "whitelist") {
          return { ...project, whitelisted: [...project.whitelisted, userId] }
        } else {
          return { ...project, blacklisted: [...project.blacklisted, userId] }
        }
      }
      return project
    })

    setProjects(updatedProjects)
    localStorage.setItem("userProjects", JSON.stringify(updatedProjects))
    updateStats(updatedProjects)
    setSelectedProject(updatedProjects.find((p) => p.id === selectedProject.id) || null)
    setNewUserId("")
    showNotification(`User ID ${userIdType}ed successfully!`)
  }

  const removeUserId = (userId: string, type: "whitelist" | "blacklist") => {
    if (!selectedProject) return

    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProject.id) {
        if (type === "whitelist") {
          return { ...project, whitelisted: project.whitelisted.filter((id) => id !== userId) }
        } else {
          return { ...project, blacklisted: project.blacklisted.filter((id) => id !== userId) }
        }
      }
      return project
    })

    setProjects(updatedProjects)
    localStorage.setItem("userProjects", JSON.stringify(updatedProjects))
    updateStats(updatedProjects)
    setSelectedProject(updatedProjects.find((p) => p.id === selectedProject.id) || null)
  }

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("currentKey")
    localStorage.removeItem("keyExpiry")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <Card className="bg-black border-orange-500 p-4">
            <p className="text-orange-400 text-sm">{notification}</p>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="bg-black border-b border-orange-500/30 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-orange-400" />
            <h1 className="text-2xl font-bold text-orange-400">LuaGuard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-orange-400">
              <Calendar className="w-4 h-4" />
              <span>Expires: {keyExpiry}</span>
            </div>
            <div className="text-sm text-orange-400">{currentTime}</div>
            <Button
              onClick={() => router.push("/pricing")}
              variant="outline"
              size="sm"
              className="bg-black border-orange-500 text-orange-400 hover:bg-orange-500/10"
            >
              <Coins className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-black border-orange-500 text-orange-400 hover:bg-orange-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black border-b border-orange-500/30 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
            >
              Dashboard
            </Button>
            <Button variant="ghost" className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10">
              Projects
            </Button>
            <Button
              onClick={() => router.push("/status")}
              variant="ghost"
              className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
            >
              Status
            </Button>
            <Button
              onClick={() => router.push("/settings")}
              variant="ghost"
              className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
            >
              Settings
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          {/* Header with Stats */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-orange-400 mb-2">Projects</h2>
              <p className="text-orange-400">Manage your protected Lua scripts</p>
            </div>

            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black border-orange-500 text-orange-400 max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-orange-400">Create a Project</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 p-4">
                  <div>
                    <Label htmlFor="project-name" className="text-orange-400">
                      Project Name
                    </Label>
                    <Input
                      id="project-name"
                      placeholder="Name your project"
                      value={newProject.name}
                      onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                      className="bg-black border-orange-500 text-orange-400 mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="script-file" className="text-orange-400">
                      Upload Script (.txt only)
                    </Label>
                    <Input
                      id="script-file"
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="bg-black border-orange-500 text-orange-400 mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={newProject.type === "free-for-all" ? "default" : "outline"}
                      onClick={() => setNewProject((prev) => ({ ...prev, type: "free-for-all" }))}
                      className={
                        newProject.type === "free-for-all"
                          ? "bg-orange-500 hover:bg-orange-600 text-black"
                          : "bg-black border-orange-500 text-orange-400 hover:bg-orange-500/10"
                      }
                    >
                      Free for All
                    </Button>
                    <Button
                      variant={newProject.type === "user-management" ? "default" : "outline"}
                      onClick={() => setNewProject((prev) => ({ ...prev, type: "user-management" }))}
                      className={
                        newProject.type === "user-management"
                          ? "bg-orange-500 hover:bg-orange-600 text-black"
                          : "bg-black border-orange-500 text-orange-400 hover:bg-orange-500/10"
                      }
                    >
                      User Management
                    </Button>
                  </div>

                  <Button
                    onClick={createProject}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3"
                  >
                    Create Project
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black border-orange-500 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black border border-orange-500 rounded-lg">
                  <UserCheck className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-400">{stats.whitelisted}</h3>
                  <p className="text-orange-400">Whitelisted Users</p>
                </div>
              </div>
            </Card>

            <Card className="bg-black border-orange-500 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black border border-orange-500 rounded-lg">
                  <UserX className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-400">{stats.blacklisted}</h3>
                  <p className="text-orange-400">Blacklisted Users</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-orange-400">Your Projects</h3>

            {projects.length === 0 ? (
              <Card className="bg-black border-orange-500 p-8 text-center">
                <Shield className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-orange-400 mb-2">No Projects Yet</h3>
                <p className="text-orange-400 mb-4">Create your first protected Lua script project</p>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto pr-2">
                {projects.map((project) => (
                  <Card key={project.id} className="bg-black border-orange-500 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-orange-400 truncate">{project.name}</h4>
                        <span
                          className={`px-2 py-1 rounded text-xs border ${
                            project.type === "free-for-all"
                              ? "bg-black border-orange-500 text-orange-400"
                              : "bg-black border-orange-500 text-orange-400"
                          }`}
                        >
                          {project.type === "free-for-all" ? "Free" : "Managed"}
                        </span>
                      </div>

                      <div className="text-sm text-orange-400">
                        <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                        <p>Executions: {project.executions}</p>
                        {project.type === "user-management" && (
                          <p>
                            Users: {project.whitelisted.length} whitelisted, {project.blacklisted.length} blacklisted
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={() => downloadLoader(project)}
                          size="sm"
                          className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => copyLoadstring(project)}
                          size="sm"
                          className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => deleteProject(project.id)}
                          size="sm"
                          className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {project.type === "user-management" && (
                        <Button
                          onClick={() => {
                            setSelectedProject(project)
                            setShowManageModal(true)
                          }}
                          size="sm"
                          className="w-full bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Manage IDs
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* User Management Modal */}
      <Dialog open={showManageModal} onOpenChange={setShowManageModal}>
        <DialogContent className="bg-black border-orange-500 text-orange-400 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-orange-400">
              Add user IDs you wanna whitelist or blacklist from your project
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter User ID"
                value={newUserId}
                onChange={(e) => setNewUserId(e.target.value)}
                className="bg-black border-orange-500 text-orange-400"
                onKeyPress={(e) => e.key === "Enter" && addUserId()}
              />
              <select
                value={userIdType}
                onChange={(e) => setUserIdType(e.target.value as "whitelist" | "blacklist")}
                className="bg-black border border-orange-500 rounded px-3 py-2 text-orange-400"
              >
                <option value="whitelist">Whitelist</option>
                <option value="blacklist">Blacklist</option>
              </select>
              <Button onClick={addUserId} className="bg-orange-500 hover:bg-orange-600 text-black">
                Send
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-auto">
              {/* Whitelisted Users */}
              <div>
                <h4 className="text-orange-400 font-semibold mb-2">
                  Whitelisted ({selectedProject?.whitelisted.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedProject?.whitelisted.map((userId) => (
                    <div
                      key={userId}
                      className="flex items-center justify-between bg-black border border-orange-500 p-2 rounded"
                    >
                      <span className="text-orange-400 text-sm">{userId}</span>
                      <Button
                        onClick={() => removeUserId(userId, "whitelist")}
                        size="sm"
                        variant="ghost"
                        className="text-orange-400 hover:text-orange-300 p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blacklisted Users */}
              <div>
                <h4 className="text-orange-400 font-semibold mb-2">
                  Blacklisted ({selectedProject?.blacklisted.length || 0})
                </h4>
                <div className="space-y-2">
                  {selectedProject?.blacklisted.map((userId) => (
                    <div
                      key={userId}
                      className="flex items-center justify-between bg-black border border-orange-500 p-2 rounded"
                    >
                      <span className="text-orange-400 text-sm">{userId}</span>
                      <Button
                        onClick={() => removeUserId(userId, "blacklist")}
                        size="sm"
                        variant="ghost"
                        className="text-orange-400 hover:text-orange-300 p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
