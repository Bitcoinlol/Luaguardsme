"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Users, UserCheck, UserX, Coins, LogOut, Calendar } from "lucide-react"
import PricingModal from "@/components/pricing-modal"

export default function Dashboard() {
  const [userType, setUserType] = useState<"user" | "owner" | null>(null)
  const [keyExpiry, setKeyExpiry] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<string>("")
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [stats, setStats] = useState({
    executions: 0,
    whitelisted: 0,
    blacklisted: 0,
  })
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const storedUserType = localStorage.getItem("userType") as "user" | "owner" | null
    const storedKey = localStorage.getItem("currentKey")
    const storedExpiry = localStorage.getItem("keyExpiry")

    if (!storedUserType || !storedKey) {
      router.push("/")
      return
    }

    setUserType(storedUserType)
    if (storedExpiry) {
      setKeyExpiry(new Date(storedExpiry).toLocaleDateString())
    }

    // Update current time
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleString())
    }
    updateTime()
    const timeInterval = setInterval(updateTime, 1000)

    // Load stats from localStorage
    const savedStats = localStorage.getItem("userStats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }

    return () => clearInterval(timeInterval)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("currentKey")
    localStorage.removeItem("keyExpiry")
    router.push("/")
  }

  const navigateToTab = (tab: string) => {
    router.push(`/${tab}`)
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-orange-400">Loading...</div>
      </div>
    )
  }

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
            <div className="flex items-center gap-2 text-sm text-orange-400">
              <Calendar className="w-4 h-4" />
              <span>Expires: {keyExpiry}</span>
            </div>
            <div className="text-sm text-orange-400">{currentTime}</div>
            <Button
              onClick={() => setShowPricingModal(true)}
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
            <Button variant="ghost" className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10">
              Dashboard
            </Button>
            <Button
              onClick={() => navigateToTab("projects")}
              variant="ghost"
              className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
            >
              Projects
            </Button>
            <Button
              onClick={() => navigateToTab("status")}
              variant="ghost"
              className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
            >
              Status
            </Button>
            <Button
              onClick={() => navigateToTab("settings")}
              variant="ghost"
              className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
            >
              Settings
            </Button>
            {userType === "owner" && (
              <Button
                onClick={() => navigateToTab("admin")}
                variant="ghost"
                className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
              >
                Generate Keys
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-orange-400 mb-2">Dashboard</h2>
            <p className="text-orange-400">Welcome to your LuaGuard control panel</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black border-orange-500 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black border border-orange-500 rounded-lg">
                  <Users className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-400">{stats.executions}</h3>
                  <p className="text-orange-400">Script Executions</p>
                </div>
              </div>
            </Card>

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

          {/* Quick Actions */}
          <Card className="bg-black border-orange-500 p-6">
            <h3 className="text-xl font-semibold text-orange-400 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                onClick={() => navigateToTab("projects")}
                className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10 p-4 h-auto flex-col gap-2"
              >
                <Shield className="w-6 h-6" />
                <span>Manage Projects</span>
              </Button>

              <Button
                onClick={() => navigateToTab("settings")}
                className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10 p-4 h-auto flex-col gap-2"
              >
                <Users className="w-6 h-6" />
                <span>User Settings</span>
              </Button>

              <Button
                onClick={() => setShowPricingModal(true)}
                className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10 p-4 h-auto flex-col gap-2"
              >
                <Coins className="w-6 h-6" />
                <span>Upgrade Plan</span>
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Pricing Modal */}
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
    </div>
  )
}
