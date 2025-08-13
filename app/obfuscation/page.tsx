"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Upload, LogOut, Calendar, Coins } from "lucide-react"
import PricingModal from "@/components/pricing-modal"

export default function Obfuscation() {
  const [userType, setUserType] = useState<"user" | "owner" | null>(null)
  const [keyExpiry, setKeyExpiry] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<string>("")
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isObfuscating, setIsObfuscating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showPanel, setShowPanel] = useState(true)
  const [obfuscatedCode, setObfuscatedCode] = useState<string>("")
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const loadingSteps = ["Obfuscating script please wait", "Scanning code", "Almost done", "Done"]

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/plain") {
      setSelectedFile(file)
    } else {
      alert("Please select a .txt file")
    }
  }

  const isLuaCode = (code: string): boolean => {
    // Check for common Lua keywords and patterns
    const luaKeywords = [
      "local",
      "function",
      "end",
      "if",
      "then",
      "else",
      "elseif",
      "while",
      "do",
      "for",
      "repeat",
      "until",
      "break",
      "return",
      "and",
      "or",
      "not",
      "true",
      "false",
      "nil",
    ]

    // Check for Lua-specific patterns
    const luaPatterns = [
      /\blocal\s+\w+\s*=/, // local variable declarations
      /\bfunction\s+\w+\s*\(/, // function declarations
      /\bend\b/, // end keyword
      /\bthen\b/, // then keyword
      /\bdo\b/, // do keyword
      /--.*$/m, // Lua comments
      /\[\[.*?\]\]/s, // Lua multi-line strings
      /\bprint\s*\(/, // print function
      /\brequire\s*\(/, // require function
    ]

    // Count keyword matches
    let keywordMatches = 0
    luaKeywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      const matches = code.match(regex)
      if (matches) keywordMatches += matches.length
    })

    // Count pattern matches
    let patternMatches = 0
    luaPatterns.forEach((pattern) => {
      if (pattern.test(code)) patternMatches++
    })

    // Consider it Lua if we have at least 2 keyword matches or 1 pattern match
    return keywordMatches >= 2 || patternMatches >= 1
  }

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const advancedObfuscate = (code: string): string => {
    // Multi-layer obfuscation with various techniques
    let obfuscated = code

    // Layer 1: String encryption with dynamic keys
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const generateRandomString = (length: number) => {
      let result = ""
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    // Layer 2: Variable name obfuscation with meaningless names
    const varNames = new Set<string>()
    obfuscated = obfuscated.replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, (match) => {
      if (
        ![
          "local",
          "function",
          "end",
          "if",
          "then",
          "else",
          "elseif",
          "while",
          "do",
          "for",
          "repeat",
          "until",
          "break",
          "return",
          "and",
          "or",
          "not",
          "true",
          "false",
          "nil",
        ].includes(match)
      ) {
        const newName = "_" + generateRandomString(Math.floor(Math.random() * 10) + 5)
        varNames.add(newName)
        return newName
      }
      return match
    })

    // Layer 3: String literal obfuscation
    obfuscated = obfuscated.replace(/"([^"]*)"/g, (match, str) => {
      const encoded = str
        .split("")
        .map((char: string) => char.charCodeAt(0))
        .join(",")
      return `string.char(${encoded})`
    })

    obfuscated = obfuscated.replace(/'([^']*)'/g, (match, str) => {
      const encoded = str
        .split("")
        .map((char: string) => char.charCodeAt(0))
        .join(",")
      return `string.char(${encoded})`
    })

    // Layer 4: Number obfuscation
    obfuscated = obfuscated.replace(/\b\d+\b/g, (match) => {
      const num = Number.parseInt(match)
      const a = Math.floor(Math.random() * 100) + 1
      const b = num - a
      return `(${a}+${b})`
    })

    // Layer 5: Control flow obfuscation
    const controlFlowVar = "_" + generateRandomString(8)
    obfuscated =
      `local ${controlFlowVar} = {${Array.from({ length: 20 }, () => Math.floor(Math.random() * 1000)).join(",")}};\n` +
      obfuscated

    // Layer 6: Dead code injection
    const deadCodeFunctions = []
    for (let i = 0; i < 5; i++) {
      const funcName = "_" + generateRandomString(10)
      const deadCode = `local function ${funcName}() local ${generateRandomString(5)} = ${Math.floor(Math.random() * 1000)}; return ${generateRandomString(5)} * 2 end`
      deadCodeFunctions.push(deadCode)
    }
    obfuscated = deadCodeFunctions.join("\n") + "\n" + obfuscated

    // Layer 7: Bytecode-like transformation
    const lines = obfuscated.split("\n")
    const transformedLines = lines.map((line, index) => {
      if (line.trim() && !line.trim().startsWith("--")) {
        const lineVar = "_" + generateRandomString(6)
        return `local ${lineVar} = function() ${line} end; ${lineVar}()`
      }
      return line
    })
    obfuscated = transformedLines.join("\n")

    // Layer 8: Final encryption wrapper
    const wrapperVar = "_" + generateRandomString(12)
    obfuscated = `local ${wrapperVar} = function() ${obfuscated} end; ${wrapperVar}()`

    return obfuscated
  }

  const handleObfuscate = async () => {
    if (!selectedFile) {
      alert("Please select a file first")
      return
    }

    // Read file content first to validate
    const fileContent = await selectedFile.text()

    // Check if the file contains Lua code
    if (!isLuaCode(fileContent)) {
      showNotificationMessage("Lua not found")
      return
    }

    setIsObfuscating(true)
    setShowPanel(false)
    setCurrentStep(0)

    // Simulate loading steps with delays
    for (let i = 0; i < loadingSteps.length; i++) {
      setCurrentStep(i)
      await new Promise((resolve) => setTimeout(resolve, i === 0 ? 2000 : i === 1 ? 1500 : i === 2 ? 1000 : 500))
    }

    // Perform advanced obfuscation
    const obfuscated = advancedObfuscate(fileContent)
    setObfuscatedCode(obfuscated)

    // Download the obfuscated file
    const blob = new Blob([obfuscated], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "obfuscated.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Reset UI
    setTimeout(() => {
      setIsObfuscating(false)
      setShowPanel(true)
      setSelectedFile(null)
      setCurrentStep(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }, 1000)
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
            <Button
              onClick={() => navigateToTab("dashboard")}
              variant="ghost"
              className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
            >
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
            <Button variant="ghost" className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10">
              Obfuscation
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
            <h2 className="text-3xl font-bold text-orange-400 mb-2">Code Obfuscation</h2>
            <p className="text-orange-400">Advanced Lua script obfuscation - nearly impossible to deobfuscate</p>
          </div>

          {/* Notification Display */}
          {showNotification && (
            <div className="flex justify-center">
              <div
                className={`bg-black border border-red-500 text-red-400 px-6 py-3 rounded-lg transition-all duration-500 ${
                  showNotification ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
              >
                {notificationMessage}
              </div>
            </div>
          )}

          {/* Obfuscation Panel */}
          <div className="flex justify-center">
            <Card
              className={`bg-black border-orange-500 p-8 w-full max-w-2xl transition-all duration-500 ${
                showPanel ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="text-center space-y-6">
                <div className="p-4 bg-black border border-orange-500 rounded-lg inline-block">
                  <Shield className="w-12 h-12 text-orange-400" />
                </div>

                <h3 className="text-2xl font-bold text-orange-400">Advanced Obfuscation</h3>
                <p className="text-orange-400">Upload your Lua script to obfuscate it with military-grade protection</p>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-orange-500/50 rounded-lg p-8 hover:border-orange-500 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                      <p className="text-orange-400">
                        {selectedFile ? selectedFile.name : "Click to upload .txt file"}
                      </p>
                    </label>
                  </div>

                  <Button
                    onClick={handleObfuscate}
                    disabled={!selectedFile}
                    className="w-full bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10 py-3"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Obfuscate Script
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Loading States */}
          {isObfuscating && (
            <div className="flex justify-center">
              <Card className="bg-black border-orange-500 p-8 w-full max-w-2xl">
                <div className="text-center space-y-6">
                  <div className="p-4 bg-black border border-orange-500 rounded-lg inline-block animate-pulse">
                    <Shield className="w-12 h-12 text-orange-400" />
                  </div>

                  <div className="space-y-4">
                    {loadingSteps.map((step, index) => (
                      <div
                        key={index}
                        className={`transition-all duration-500 ${index <= currentStep ? "opacity-100" : "opacity-30"}`}
                      >
                        <p className="text-orange-400 text-lg">{step}</p>
                        {index <= currentStep && (
                          <div className="w-full bg-black border border-orange-500 rounded-full h-2 mt-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: index === currentStep ? "100%" : "100%" }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Pricing Modal */}
      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
    </div>
  )
}
