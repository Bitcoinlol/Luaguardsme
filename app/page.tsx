"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Shield, Copy, Check } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [key, setKey] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [hasGeneratedFreeKey, setHasGeneratedFreeKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user already generated a free key
    const freeKeyGenerated = localStorage.getItem("freeKeyGenerated")
    if (freeKeyGenerated) {
      setHasGeneratedFreeKey(true)
    }

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

    return () => {
      document.removeEventListener("contextmenu", disableRightClick)
      document.removeEventListener("keydown", disableKeyboard)
    }
  }, [])

  const generateFreeKey = () => {
    if (hasGeneratedFreeKey) {
      showNotificationMessage("You have already generated a free key!")
      return
    }

    const freeKey = `FREE_${Math.random().toString(36).substring(2, 15).toUpperCase()}_30D`

    navigator.clipboard.writeText(freeKey).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      localStorage.setItem("freeKeyGenerated", "true")
      localStorage.setItem("freeKey", freeKey)
      localStorage.setItem("keyExpiry", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())

      setHasGeneratedFreeKey(true)
      showNotificationMessage(
        "Key copied! This key will expire in 30 days. When your 30 days is over please upgrade your plan.",
      )
    })
  }

  const handleLogin = () => {
    if (!key.trim()) {
      showNotificationMessage("Please enter a key!")
      return
    }

    // Check if it's the owner key
    if (key === "Ownerspecialkidmelol::founderkey=yes") {
      localStorage.setItem("userType", "owner")
      localStorage.setItem("currentKey", key)
      router.push("/dashboard")
      return
    }

    // Check if it's a valid key format
    if (key.startsWith("FREE_") || key.includes("MONTH_") || key.includes("YEAR_")) {
      localStorage.setItem("userType", "user")
      localStorage.setItem("currentKey", key)

      // Set expiry based on key type
      const expiryDate = new Date()
      if (key.startsWith("FREE_")) {
        expiryDate.setDate(expiryDate.getDate() + 30)
      } else if (key.includes("1MONTH_")) {
        expiryDate.setMonth(expiryDate.getMonth() + 1)
      } else if (key.includes("5MONTH_")) {
        expiryDate.setMonth(expiryDate.getMonth() + 5)
      } else if (key.includes("1YEAR_")) {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1)
      } else if (key.includes("2YEAR_")) {
        expiryDate.setFullYear(expiryDate.getFullYear() + 2)
      }

      localStorage.setItem("keyExpiry", expiryDate.toISOString())
      router.push("/dashboard")
    } else {
      showNotificationMessage("Invalid key format!")
    }
  }

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden bg-cyber-grid">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <Card className="bg-black/90 border-orange-500/50 backdrop-blur-sm p-4 max-w-sm glow-orange">
            <div className="flex items-center gap-2">
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-orange-400" />}
              <p className="text-orange-100 text-sm">{notificationMessage}</p>
            </div>
          </Card>
        </div>
      )}

      <Card className="w-full max-w-md bg-black/80 backdrop-blur-sm border-orange-500/30 shadow-2xl shadow-orange-500/20 glow-orange">
        <div className="p-8 space-y-6">
          {/* Header with logo */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <Shield className="w-10 h-10 text-orange-400" />
                <div className="absolute inset-0 w-10 h-10 bg-orange-400/20 rounded-full blur-md"></div>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent text-glow-orange">
                LuaGuard
              </h1>
            </div>
            <p className="text-orange-300/80 text-sm">Advanced Lua Script Protection</p>
          </div>

          {/* Key input */}
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your key..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="bg-black/50 border-orange-600/50 text-orange-100 placeholder:text-orange-400/60 focus:border-orange-400 focus:ring-orange-400/20"
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleLogin}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-black font-semibold shadow-lg shadow-orange-500/25 glow-orange"
              >
                Login
              </Button>

              <Button
                onClick={generateFreeKey}
                disabled={hasGeneratedFreeKey}
                variant="outline"
                className="border-orange-500/50 text-orange-300 hover:bg-orange-500/10 hover:border-orange-400 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
              >
                Get Free Key
              </Button>
            </div>
          </div>

          {/* Preview section */}
          <div className="space-y-4 pt-6 border-t border-orange-700/50">
            <h3 className="text-lg font-semibold text-orange-300 text-center">What LuaGuard Offers</h3>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-black/30 rounded-lg p-3 border border-orange-600/30">
                <h4 className="text-orange-400 font-medium text-sm">Script Protection</h4>
                <p className="text-orange-200/80 text-xs mt-1">Advanced obfuscation and anti-tampering</p>
              </div>

              <div className="bg-black/30 rounded-lg p-3 border border-orange-600/30">
                <h4 className="text-orange-400 font-medium text-sm">User Management</h4>
                <p className="text-orange-200/80 text-xs mt-1">Whitelist/blacklist system with HWID protection</p>
              </div>

              <div className="bg-black/30 rounded-lg p-3 border border-orange-600/30">
                <h4 className="text-orange-400 font-medium text-sm">Analytics Dashboard</h4>
                <p className="text-orange-200/80 text-xs mt-1">Real-time execution tracking and statistics</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
