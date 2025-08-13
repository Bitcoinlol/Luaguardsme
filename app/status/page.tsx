"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, TrendingUp, TrendingDown, Activity, Calendar, LogOut, Coins } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Project {
  id: string
  name: string
  type: "free-for-all" | "user-management"
  whitelisted: string[]
  blacklisted: string[]
  executions: number
  createdAt: string
}

export default function StatusPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [keyExpiry, setKeyExpiry] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const router = useRouter()

  const generateChartData = (totalWhitelisted: number, totalBlacklisted: number, totalExecutions: number) => {
    const data = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        whitelisted: totalWhitelisted,
        blacklisted: totalBlacklisted,
        executions: totalExecutions,
      })
    }

    return data
  }

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
      setProjects(JSON.parse(savedProjects))
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

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("currentKey")
    localStorage.removeItem("keyExpiry")
    router.push("/")
  }

  const totalWhitelisted = projects.reduce((sum, p) => sum + p.whitelisted.length, 0)
  const totalBlacklisted = projects.reduce((sum, p) => sum + p.blacklisted.length, 0)
  const totalExecutions = projects.reduce((sum, p) => sum + p.executions, 0)

  const chartData = generateChartData(totalWhitelisted, totalBlacklisted, totalExecutions)

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-orange-500/30 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-orange-400" />
            <h1 className="text-2xl font-bold text-orange-400">LuaGuard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-orange-300">
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
              className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/10"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => router.push("/projects")}
              variant="ghost"
              className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/10"
            >
              Projects
            </Button>
            <Button variant="ghost" className="text-orange-400 hover:text-orange-100 hover:bg-orange-500/10">
              Status
            </Button>
            <Button
              onClick={() => router.push("/settings")}
              variant="ghost"
              className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/10"
            >
              Settings
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-orange-400 mb-2">Project Status</h2>
            <p className="text-orange-300">Monitor your project performance and user activity</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black border-orange-500/30 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <Activity className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-400">{totalExecutions}</h3>
                  <p className="text-orange-300">Total Executions</p>
                </div>
              </div>
            </Card>

            <Card className="bg-black border-orange-500/30 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-400">{totalWhitelisted}</h3>
                  <p className="text-orange-300">Whitelisted Users</p>
                </div>
              </div>
            </Card>

            <Card className="bg-black border-orange-500/30 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <TrendingDown className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-400">{totalBlacklisted}</h3>
                  <p className="text-orange-300">Blacklisted Users</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Activity Chart */}
            <Card className="bg-black border-orange-500/30 p-6">
              <h3 className="text-xl font-semibold text-orange-400 mb-4">User Activity (7 Days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f97316" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#f97316" />
                    <YAxis stroke="#f97316" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#000000",
                        border: "1px solid #f97316",
                        borderRadius: "8px",
                        color: "#f97316",
                      }}
                    />
                    <Line type="monotone" dataKey="whitelisted" stroke="#f97316" strokeWidth={2} name="Whitelisted" />
                    <Line type="monotone" dataKey="blacklisted" stroke="#fb923c" strokeWidth={2} name="Blacklisted" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-orange-300 text-sm mt-2">
                {totalWhitelisted === 0 && totalBlacklisted === 0
                  ? "No user activity yet - lines will update as users interact with your projects"
                  : "Whitelisted users trend upward, blacklisted users trend downward over time"}
              </p>
            </Card>

            {/* Execution Trends */}
            <Card className="bg-black border-orange-500/30 p-6">
              <h3 className="text-xl font-semibold text-orange-400 mb-4">Script Executions (7 Days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f97316" opacity={0.2} />
                    <XAxis dataKey="date" stroke="#f97316" />
                    <YAxis stroke="#f97316" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#000000",
                        border: "1px solid #f97316",
                        borderRadius: "8px",
                        color: "#f97316",
                      }}
                    />
                    <Line type="monotone" dataKey="executions" stroke="#f97316" strokeWidth={3} name="Executions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-orange-300 text-sm mt-2">
                {totalExecutions === 0
                  ? "No executions yet - chart will show activity as users run your scripts"
                  : "Script execution trends over the past 7 days"}
              </p>
            </Card>
          </div>

          {/* Project Performance */}
          <Card className="bg-black border-orange-500/30 p-6">
            <h3 className="text-xl font-semibold text-orange-400 mb-4">Project Performance</h3>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-16 h-16 text-orange-400/50 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-orange-300 mb-2">No Projects Yet</h4>
                <p className="text-orange-400">Create projects to see performance analytics</p>
                <Button
                  onClick={() => router.push("/projects")}
                  className="mt-4 bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                >
                  Create Your First Project
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-black border border-orange-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-orange-400">{project.name}</h4>
                        <p className="text-orange-300 text-sm">
                          {project.type === "free-for-all" ? "Free for All" : "User Management"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-400">{project.executions}</div>
                        <div className="text-orange-300 text-sm">Executions</div>
                      </div>
                    </div>
                    {project.type === "user-management" && (
                      <div className="mt-2 flex gap-4 text-sm">
                        <span className="text-orange-300">Whitelisted: {project.whitelisted.length}</span>
                        <span className="text-orange-300">Blacklisted: {project.blacklisted.length}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
