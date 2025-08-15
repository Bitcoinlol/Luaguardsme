"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Shield, Copy, Check, Upload, X, Send, CreditCard, FileImage } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [key, setKey] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [hasGeneratedFreeKey, setHasGeneratedFreeKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showProofModal, setShowProofModal] = useState(false)
  const [proofData, setProofData] = useState({
    whatBought: "",
    selectedPlan: "",
    screenshot: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userIP, setUserIP] = useState("")
  const router = useRouter()

  const planLinks = {
    "1 month": "https://www.roblox.com/game-pass/1386962628/1-MONTH-PLAN",
    "5 months": "https://www.roblox.com/game-pass/1386480582/5-MONTHS-PLAN",
    "1 year": "https://www.roblox.com/game-pass/1386722619/1-YEAR-PLAN",
    "2 years": "https://www.roblox.com/game-pass/1386992569/2-YEARS-PLAN",
  }

  const planPrices = {
    "1 month": "250 R$",
    "5 months": "700 R$",
    "1 year": "1,500 R$",
    "2 years": "2,500 R$",
  }

  const handlePlanClick = (plan: string) => {
    window.open(planLinks[plan as keyof typeof planLinks], "_blank")
  }

  useEffect(() => {
    const getUserIP = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json")
        const data = await response.json()
        setUserIP(data.ip)
      } catch (error) {
        console.log("Could not fetch IP address")
      }
    }
    getUserIP()

    const freeKeyGenerated = localStorage.getItem("freeKeyGenerated")
    if (freeKeyGenerated) {
      setHasGeneratedFreeKey(true)
    }

    const disableRightClick = (e: MouseEvent) => e.preventDefault()
    const disableKeyboard = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "C" || e.key === "J")) ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "s")
      ) {
        e.preventDefault()
        return false
      }
    }

    const disableDragDrop = (e: DragEvent) => e.preventDefault()

    const disableSelection = (e: Event) => e.preventDefault()

    document.addEventListener("contextmenu", disableRightClick)
    document.addEventListener("keydown", disableKeyboard)
    document.addEventListener("dragstart", disableDragDrop)
    document.addEventListener("selectstart", disableSelection)

    return () => {
      document.removeEventListener("contextmenu", disableRightClick)
      document.removeEventListener("keydown", disableKeyboard)
      document.removeEventListener("dragstart", disableDragDrop)
      document.removeEventListener("selectstart", disableSelection)
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

    if (key === "Ownerspecialkidmelol::founderkey=yes") {
      const ownerIP = localStorage.getItem("ownerIP")

      if (!ownerIP) {
        // First time login - store owner IP
        localStorage.setItem("ownerIP", userIP)
        localStorage.setItem("userType", "owner")
        localStorage.setItem("currentKey", key)
        router.push("/dashboard")
        return
      } else if (ownerIP !== userIP) {
        // Unauthorized IP trying to access owner account
        const unauthorizedAttempts = JSON.parse(localStorage.getItem("unauthorizedAttempts") || "[]")
        const newAttempt = {
          ip: userIP,
          timestamp: new Date().toLocaleString(),
          key: key,
          blocked: true,
        }
        unauthorizedAttempts.push(newAttempt)
        localStorage.setItem("unauthorizedAttempts", JSON.stringify(unauthorizedAttempts))

        showNotificationMessage("You are not allowed to login to the owners account")
        return
      } else {
        // Correct owner IP
        localStorage.setItem("userType", "owner")
        localStorage.setItem("currentKey", key)
        router.push("/dashboard")
        return
      }
    }

    if (key.startsWith("FREE_") || key.includes("MONTH_") || key.includes("YEAR_")) {
      localStorage.setItem("userType", "user")
      localStorage.setItem("currentKey", key)

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setProofData((prev) => ({ ...prev, screenshot: file }))
    } else {
      showNotificationMessage("Please upload a valid image file!")
    }
  }

  const submitProof = async () => {
    if (!proofData.whatBought || !proofData.selectedPlan || !proofData.screenshot) {
      showNotificationMessage("Please fill all fields and upload a screenshot!")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()

      formData.append("file", proofData.screenshot, "proof.png")

      const webhookData = {
        embeds: [
          {
            title: "🎫 New Plan Purchase Proof",
            color: 0xff6b35,
            fields: [
              {
                name: "What they bought",
                value: proofData.whatBought,
                inline: true,
              },
              {
                name: "Selected plan",
                value: proofData.selectedPlan,
                inline: true,
              },
              {
                name: "Timestamp",
                value: new Date().toLocaleString(),
                inline: false,
              },
            ],
            image: {
              url: "attachment://proof.png",
            },
            footer: {
              text: "LuaGuard Proof System",
            },
          },
        ],
      }

      formData.append("payload_json", JSON.stringify(webhookData))

      const response = await fetch(
        "https://discord.com/api/webhooks/1403105555840634970/PZG4DJLOdNYgM8uLnGl19LBas19aLV37FMFQap4nO4OPMjClTw7qj-Zg816uSjNSZUZL",
        {
          method: "POST",
          body: formData,
        },
      )

      if (response.ok) {
        showNotificationMessage("Proof submitted successfully! We'll review it shortly.")
        setShowProofModal(false)
        setProofData({ whatBought: "", selectedPlan: "", screenshot: null })
      } else {
        showNotificationMessage("Failed to submit proof. Please try again.")
      }
    } catch (error) {
      showNotificationMessage("Error submitting proof. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 5000)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden bg-cyber-grid select-none">
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

      {showProofModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-black border-orange-500 shadow-2xl shadow-orange-500/20">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-orange-400">Submit Purchase Proof</h3>
                <Button
                  onClick={() => setShowProofModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-orange-400 hover:text-orange-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-orange-400">What did you buy?</Label>
                  <Input
                    placeholder="e.g., I bought 1 month plan"
                    value={proofData.whatBought}
                    onChange={(e) => setProofData((prev) => ({ ...prev, whatBought: e.target.value }))}
                    className="bg-black border-orange-500 text-orange-400"
                  />
                </div>

                <div>
                  <Label className="text-orange-400">Select Plan</Label>
                  <select
                    value={proofData.selectedPlan}
                    onChange={(e) => setProofData((prev) => ({ ...prev, selectedPlan: e.target.value }))}
                    className="w-full bg-black border border-orange-500 text-orange-400 rounded-md p-2"
                  >
                    <option value="">Select a plan</option>
                    <option value="1 month">1 month</option>
                    <option value="5 months">5 months</option>
                    <option value="1 year">1 year</option>
                    <option value="2 years">2 years</option>
                  </select>
                </div>

                <div>
                  <Label className="text-orange-400">Upload Screenshot</Label>
                  <div className="border-2 border-dashed border-orange-500/50 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label htmlFor="screenshot-upload" className="cursor-pointer">
                      {proofData.screenshot ? (
                        <div className="flex items-center justify-center gap-2 text-orange-400">
                          <FileImage className="w-5 h-5" />
                          <span>{proofData.screenshot.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-orange-400/60">
                          <Upload className="w-8 h-8" />
                          <span>Click to upload screenshot</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <Button
                  onClick={submitProof}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-black font-semibold"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Proof
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="flex gap-6 w-full max-w-4xl">
        <Card className="flex-1 bg-black/80 backdrop-blur-sm border-orange-500/30 shadow-2xl shadow-orange-500/20 glow-orange">
          <div className="p-8 space-y-6">
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
                  className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Get Free Key
                </Button>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => setShowProofModal(true)}
                  className="w-full bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Proof
                </Button>
              </div>
            </div>

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

        <Card className="flex-1 bg-black/80 backdrop-blur-sm border-orange-500/30 shadow-2xl shadow-orange-500/20 glow-orange">
          <div className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <CreditCard className="w-10 h-10 text-orange-400" />
                  <div className="absolute inset-0 w-10 h-10 bg-orange-400/20 rounded-full blur-md"></div>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent text-glow-orange">
                  Plans
                </h1>
              </div>
              <p className="text-orange-300/80 text-sm">Choose Your Protection Plan</p>
            </div>

            <div className="space-y-3">
              {Object.entries(planPrices).map(([plan, price]) => (
                <Button
                  key={plan}
                  onClick={() => handlePlanClick(plan)}
                  className="w-full bg-black/30 border border-orange-600/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 transition-all duration-200 p-4 h-auto"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="text-left">
                      <div className="font-semibold text-orange-400 capitalize">{plan}</div>
                      <div className="text-orange-300/80 text-sm">Extended script protection</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-400">{price}</div>
                      <div className="text-orange-300/60 text-xs">Robux</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-orange-700/50">
              <h3 className="text-lg font-semibold text-orange-300 text-center">Plan Benefits</h3>

              <div className="grid grid-cols-1 gap-3">
                <div className="bg-black/30 rounded-lg p-3 border border-orange-600/30">
                  <h4 className="text-orange-400 font-medium text-sm">Extended Access</h4>
                  <p className="text-orange-200/80 text-xs mt-1">Longer key validity periods</p>
                </div>

                <div className="bg-black/30 rounded-lg p-3 border border-orange-600/30">
                  <h4 className="text-orange-400 font-medium text-sm">Priority Support</h4>
                  <p className="text-orange-200/80 text-xs mt-1">Faster response times and assistance</p>
                </div>

                <div className="bg-black/30 rounded-lg p-3 border border-orange-600/30">
                  <h4 className="text-orange-400 font-medium text-sm">Advanced Features</h4>
                  <p className="text-orange-200/80 text-xs mt-1">Access to premium protection tools</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
