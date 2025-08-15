"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Calendar, LogOut, Copy, Check, Key, Crown, Zap, Star, BarChart3 } from "lucide-react"

interface GeneratedKey {
  id: string
  type: string
  key: string
  duration: string
  generatedAt: string
  used: boolean
}

export default function AdminPanel() {
  const [keyExpiry, setKeyExpiry] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const [generatedKeys, setGeneratedKeys] = useState<GeneratedKey[]>([])
  const [notification, setNotification] = useState("")
  const [copiedKey, setCopiedKey] = useState("")
  const [deletingKey, setDeletingKey] = useState("")
  const router = useRouter()

  const keyTypes = [
    {
      id: "1month",
      name: "1 Month",
      duration: "30 days",
      icon: <Zap className="w-5 h-5" />,
      gradient: "from-orange-500 to-amber-500",
      prefix: "1MONTH_",
    },
    {
      id: "5months",
      name: "5 Months",
      duration: "150 days",
      icon: <Star className="w-5 h-5" />,
      gradient: "from-amber-500 to-yellow-500",
      prefix: "5MONTH_",
    },
    {
      id: "1year",
      name: "1 Year",
      duration: "365 days",
      icon: <BarChart3 className="w-5 h-5" />,
      gradient: "from-orange-600 to-red-500",
      prefix: "1YEAR_",
    },
    {
      id: "2years",
      name: "2 Years",
      duration: "730 days",
      icon: <Crown className="w-5 h-5" />,
      gradient: "from-yellow-500 to-orange-500",
      prefix: "2YEAR_",
    },
  ]

  useEffect(() => {
    // Check authentication - only owner can access
    const userType = localStorage.getItem("userType")
    const currentKey = localStorage.getItem("currentKey")

    if (userType !== "owner" || currentKey !== "Ownerspecialkidmelol::founderkey=yes") {
      router.push("/dashboard")
      return
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

    // Load generated keys from localStorage
    const savedKeys = localStorage.getItem("generatedKeys")
    if (savedKeys) {
      setGeneratedKeys(JSON.parse(savedKeys))
    }

    return () => clearInterval(timeInterval)
  }, [router])

  const generateKey = (keyType: (typeof keyTypes)[0]) => {
    const randomString = Math.random().toString(36).substring(2, 15).toUpperCase()
    const timestamp = Date.now().toString(36).toUpperCase()
    const newKey = `${keyType.prefix}${randomString}_${timestamp}`

    const generatedKey: GeneratedKey = {
      id: Math.random().toString(36).substring(2, 15),
      type: keyType.name,
      key: newKey,
      duration: keyType.duration,
      generatedAt: new Date().toISOString(),
      used: false,
    }

    // Copy to clipboard
    navigator.clipboard.writeText(newKey).then(() => {
      setCopiedKey(newKey)
      setTimeout(() => setCopiedKey(""), 3000)

      // Add to generated keys list
      const updatedKeys = [generatedKey, ...generatedKeys]
      setGeneratedKeys(updatedKeys)
      localStorage.setItem("generatedKeys", JSON.stringify(updatedKeys))

      showNotification(`${keyType.name} key generated and copied to clipboard!`)
    })
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(""), 2000)
      showNotification("Key copied to clipboard!")
    })
  }

  const deleteKey = async (keyToDelete: GeneratedKey) => {
    if (
      !confirm(
        `Are you sure you want to delete this ${keyToDelete.type} key? This will log out any user using this key.`,
      )
    ) {
      return
    }

    setDeletingKey(keyToDelete.id)

    try {
      // Remove key from generated keys list
      const updatedKeys = generatedKeys.filter((k) => k.id !== keyToDelete.id)
      setGeneratedKeys(updatedKeys)
      localStorage.setItem("generatedKeys", JSON.stringify(updatedKeys))

      // Add key to invalidated keys list
      const invalidatedKeys = JSON.parse(localStorage.getItem("invalidatedKeys") || "[]")
      invalidatedKeys.push({
        key: keyToDelete.key,
        deletedAt: new Date().toISOString(),
        type: keyToDelete.type,
      })
      localStorage.setItem("invalidatedKeys", JSON.stringify(invalidatedKeys))

      // Notify all clients to check key validity
      localStorage.setItem("keyValidationTrigger", Date.now().toString())

      showNotification(`${keyToDelete.type} key deleted successfully. Users with this key will be logged out.`)
    } catch (error) {
      showNotification("Error deleting key. Please try again.")
    } finally {
      setDeletingKey("")
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
              <Check className="w-5 h-5 text-orange-400" />
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
            <span className="px-2 py-1 bg-orange-500 text-black text-xs font-bold rounded">ADMIN</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-orange-400">
              <Calendar className="w-4 h-4" />
              <span>Never Expires</span>
            </div>
            <div className="text-sm text-orange-400">{currentTime}</div>
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
            <Button
              onClick={() => router.push("/settings")}
              variant="ghost"
              className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
            >
              Settings
            </Button>
            <Button variant="ghost" className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10">
              Generate Keys
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-orange-400" />
            <div>
              <h2 className="text-3xl font-bold text-orange-400">Admin Panel</h2>
              <p className="text-orange-400">Generate subscription keys for users</p>
            </div>
          </div>

          {/* Key Generation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyTypes.map((keyType) => (
              <Card
                key={keyType.id}
                className="bg-black border-orange-500 p-6 hover:border-orange-400 transition-colors"
              >
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-lg bg-black border border-orange-500">
                      <div className="text-orange-400">{keyType.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold text-orange-400">{keyType.name}</h3>
                    <p className="text-orange-400">{keyType.duration}</p>
                  </div>

                  <Button
                    onClick={() => generateKey(keyType)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Generate Key
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Generated Keys History */}
          <Card className="bg-black border-orange-500 p-6">
            <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Recently Generated Keys
            </h3>

            {generatedKeys.length === 0 ? (
              <div className="text-center py-8">
                <Key className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-orange-400 mb-2">No Keys Generated Yet</h4>
                <p className="text-orange-400">Generate your first subscription key using the buttons above</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {generatedKeys.map((generatedKey) => (
                  <div
                    key={generatedKey.id}
                    className="flex items-center justify-between p-4 bg-black border border-orange-500 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-orange-400 font-semibold">{generatedKey.type}</span>
                        <span className="px-2 py-1 bg-black border border-orange-500 text-orange-400 text-xs rounded">
                          {generatedKey.duration}
                        </span>
                        {generatedKey.used && (
                          <span className="px-2 py-1 bg-orange-500 text-black text-xs rounded">USED</span>
                        )}
                      </div>
                      <p className="text-orange-400 text-sm font-mono break-all">{generatedKey.key}</p>
                      <p className="text-orange-400 text-xs mt-1">
                        Generated: {new Date(generatedKey.generatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => copyKey(generatedKey.key)}
                        size="sm"
                        className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                      >
                        {copiedKey === generatedKey.key ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button
                        onClick={() => deleteKey(generatedKey)}
                        size="sm"
                        disabled={deletingKey === generatedKey.id}
                        className="bg-red-900 border border-red-500 text-red-400 hover:bg-red-500/10"
                      >
                        {deletingKey === generatedKey.id ? (
                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-black border-orange-500 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black border border-orange-500 rounded-lg">
                  <Key className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-400">{generatedKeys.length}</h3>
                  <p className="text-orange-400">Total Keys Generated</p>
                </div>
              </div>
            </Card>

            <Card className="bg-black border-orange-500 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black border border-orange-500 rounded-lg">
                  <Check className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-400">{generatedKeys.filter((k) => k.used).length}</h3>
                  <p className="text-orange-400">Keys Used</p>
                </div>
              </div>
            </Card>

            <Card className="bg-black border-orange-500 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black border border-orange-500 rounded-lg">
                  <Crown className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-orange-400">OWNER</h3>
                  <p className="text-orange-400">Admin Access Level</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
