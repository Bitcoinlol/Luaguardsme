"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, UserCheck, UserX, User, Calendar, Clock, LogOut, Coins, Search, CheckCircle } from "lucide-react"

interface RobloxUser {
  id: number
  name: string
  displayName: string
  description: string
  created: string
  isBanned: boolean
  externalAppDisplayName: string
  hasVerifiedBadge: boolean
}

interface UserProfile {
  robloxUsername: string
  robloxUserId: number
  avatarUrl: string
  accountCreated: string
  displayName: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [robloxUsername, setRobloxUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [keyExpiry, setKeyExpiry] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [stats, setStats] = useState({ whitelisted: 0, blacklisted: 0 })
  const [notification, setNotification] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const userType = localStorage.getItem("userType")
    const currentKey = localStorage.getItem("currentKey")
    if (!userType || !currentKey) {
      router.push("/")
      return
    }

    // Load saved profile
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }

    // Set key expiry and time
    const storedExpiry = localStorage.getItem("keyExpiry")
    if (storedExpiry) {
      setKeyExpiry(new Date(storedExpiry).toLocaleDateString())
    }

    // Update current time
    const updateTime = () => setCurrentTime(new Date().toLocaleString())
    updateTime()
    const timeInterval = setInterval(updateTime, 1000)

    // Load stats
    const savedStats = localStorage.getItem("userStats")
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats)
      setStats({
        whitelisted: parsedStats.whitelisted || 0,
        blacklisted: parsedStats.blacklisted || 0,
      })
    }

    return () => clearInterval(timeInterval)
  }, [router])

  const fetchRobloxUser = async () => {
    if (!robloxUsername.trim()) {
      showNotification("Please enter a Roblox username!")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/roblox/user?username=${encodeURIComponent(robloxUsername)}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        showNotification(data.error || "Roblox user not found!")
        setIsLoading(false)
        return
      }

      const user = data.user

      const newProfile: UserProfile = {
        robloxUsername: user.name,
        robloxUserId: user.id,
        avatarUrl: user.avatarUrl,
        accountCreated: new Date(user.created).toLocaleDateString(),
        displayName: user.displayName,
      }

      setProfile(newProfile)
      localStorage.setItem("userProfile", JSON.stringify(newProfile))
      showNotification("Profile updated successfully!")
    } catch (error) {
      console.error("Error fetching Roblox user:", error)
      showNotification("Error fetching user data. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-orange-400" />
              <p className="text-orange-400 text-sm">{notification}</p>
            </div>
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
            <Button
              onClick={() => router.push("/projects")}
              variant="ghost"
              className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
            >
              Projects
            </Button>
            <Button
              onClick={() => router.push("/status")}
              variant="ghost"
              className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
            >
              Status
            </Button>
            <Button variant="ghost" className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10">
              Settings
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-orange-400 mb-2">Settings</h2>
            <p className="text-orange-400">Manage your account and profile settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-black border-orange-500 p-6">
                <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </h3>

                <div className="space-y-6">
                  {/* Current Profile Display */}
                  {profile && (
                    <div className="flex items-center gap-4 p-4 bg-black border border-orange-500 rounded-lg">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={profile.avatarUrl || "/placeholder.svg"} alt={profile.robloxUsername} />
                        <AvatarFallback className="bg-black border border-orange-500 text-orange-400">
                          {profile.robloxUsername.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-orange-400">{profile.displayName}</h4>
                        <p className="text-orange-400">@{profile.robloxUsername}</p>
                        <p className="text-sm text-orange-400">User ID: {profile.robloxUserId}</p>
                      </div>
                    </div>
                  )}

                  {/* Roblox Username Input */}
                  <div className="space-y-4">
                    <Label htmlFor="roblox-username" className="text-orange-400">
                      Enter your Roblox username
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="roblox-username"
                        placeholder="Roblox username"
                        value={robloxUsername}
                        onChange={(e) => setRobloxUsername(e.target.value)}
                        className="bg-black border-orange-500 text-orange-400"
                        onKeyPress={(e) => e.key === "Enter" && fetchRobloxUser()}
                      />
                      <Button
                        onClick={fetchRobloxUser}
                        disabled={isLoading}
                        className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Account Information */}
              <Card className="bg-black border-orange-500 p-6">
                <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Account Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-black border border-orange-500 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-medium text-orange-400">Current Time</span>
                    </div>
                    <p className="text-orange-400 font-mono">{currentTime}</p>
                  </div>

                  <div className="p-4 bg-black border border-orange-500 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-medium text-orange-400">Key Expires</span>
                    </div>
                    <p className="text-orange-400 font-mono">{keyExpiry}</p>
                  </div>

                  {profile && (
                    <div className="p-4 bg-black border border-orange-500 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-orange-400" />
                        <span className="text-sm font-medium text-orange-400">Roblox Account Created</span>
                      </div>
                      <p className="text-orange-400 font-mono">{profile.accountCreated}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
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

              {/* Quick Actions */}
              <Card className="bg-black border-orange-500 p-6">
                <h3 className="text-lg font-semibold text-orange-400 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/projects")}
                    className="w-full bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                  >
                    Manage Projects
                  </Button>
                  <Button
                    onClick={() => router.push("/pricing")}
                    className="w-full bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                  >
                    Upgrade Plan
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
