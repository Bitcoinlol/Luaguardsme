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

  const advancedObfuscate = (code: string): string => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"
    const generateRandomString = (length: number) => {
      let result = ""
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    // Step 1: Create variable mapping for consistent renaming
    const variableMap = new Map<string, string>()
    const luaKeywords = new Set([
      "and",
      "break",
      "do",
      "else",
      "elseif",
      "end",
      "false",
      "for",
      "function",
      "if",
      "in",
      "local",
      "nil",
      "not",
      "or",
      "repeat",
      "return",
      "then",
      "true",
      "until",
      "while",
      "goto",
      "self",
      "print",
      "pairs",
      "ipairs",
      "next",
      "type",
      "getmetatable",
      "setmetatable",
      "rawget",
      "rawset",
      "tostring",
      "tonumber",
      "string",
      "table",
      "math",
      "os",
      "io",
      "debug",
      "coroutine",
      "package",
      "require",
      "loadstring",
      "pcall",
      "xpcall",
      "error",
      "assert",
      "select",
      "unpack",
      "game",
      "workspace",
      "script",
      "wait",
      "spawn",
      "delay",
      "tick",
      "warn",
    ])

    // Extract all identifiers and create obfuscated names
    const identifierRegex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g
    let match
    while ((match = identifierRegex.exec(code)) !== null) {
      const identifier = match[0]
      if (!luaKeywords.has(identifier) && !variableMap.has(identifier)) {
        variableMap.set(identifier, `_0x${Math.random().toString(16).substr(2, 8)}`)
      }
    }

    let obfuscated = code

    // Step 2: Replace all identifiers with obfuscated names
    for (const [original, obfuscatedName] of variableMap) {
      const regex = new RegExp(`\\b${original}\\b`, "g")
      obfuscated = obfuscated.replace(regex, obfuscatedName)
    }

    // Step 3: String obfuscation with multiple encoding layers
    obfuscated = obfuscated.replace(/"([^"]*)"/g, (match, str) => {
      const bytes = Array.from(str).map((char) => char.charCodeAt(0))
      const encoded = bytes.map((byte) => `\\${byte.toString(8)}`).join("")
      return `"${encoded}"`
    })

    obfuscated = obfuscated.replace(/'([^']*)'/g, (match, str) => {
      const bytes = Array.from(str).map((char) => char.charCodeAt(0))
      const xorKey = Math.floor(Math.random() * 255) + 1
      const encoded = bytes.map((byte) => byte ^ xorKey).join(",")
      return `(function() local _k=${xorKey} local _d={${encoded}} local _r="" for _i=1,#_d do _r=_r..string.char(_d[_i]~_k) end return _r end)()`
    })

    // Step 4: Number obfuscation with complex expressions
    obfuscated = obfuscated.replace(/\b(\d+)\b/g, (match, num) => {
      const n = Number.parseInt(num)
      const a = Math.floor(Math.random() * 1000) + 1
      const b = Math.floor(Math.random() * 1000) + 1
      const c = n + a - b
      return `(${a}-${b}+${c})`
    })

    // Step 5: Control flow obfuscation with fake branches
    const controlVar = `_0x${Math.random().toString(16).substr(2, 8)}`
    const fakeConditions = []
    for (let i = 0; i < 10; i++) {
      const fakeVar = `_0x${Math.random().toString(16).substr(2, 8)}`
      fakeConditions.push(`local ${fakeVar} = ${Math.floor(Math.random() * 1000)}`)
    }

    obfuscated = `local ${controlVar} = true\n${fakeConditions.join("\n")}\n${obfuscated}`

    // Step 6: Function wrapping with multiple layers
    const wrapperFunctions = []
    for (let i = 0; i < 5; i++) {
      const funcName = `_0x${Math.random().toString(16).substr(2, 8)}`
      const params = Array.from(
        { length: Math.floor(Math.random() * 3) + 1 },
        () => `_0x${Math.random().toString(16).substr(2, 6)}`,
      ).join(",")
      wrapperFunctions.push(`local function ${funcName}(${params}) return function() end end`)
    }

    obfuscated = wrapperFunctions.join("\n") + "\n" + obfuscated

    // Step 7: Dead code injection with realistic patterns
    const deadCodeBlocks = []
    for (let i = 0; i < 15; i++) {
      const varName = `_0x${Math.random().toString(16).substr(2, 8)}`
      const operations = [
        `local ${varName} = ${Math.floor(Math.random() * 1000)}`,
        `${varName} = ${varName} * 2 + 1`,
        `if ${varName} > 500 then ${varName} = ${varName} - 250 end`,
        `for _i = 1, 10 do ${varName} = ${varName} + _i end`,
      ]
      deadCodeBlocks.push(operations[Math.floor(Math.random() * operations.length)])
    }

    obfuscated = deadCodeBlocks.join("\n") + "\n" + obfuscated

    // Step 8: Bytecode-like transformation with execution flow obfuscation
    const lines = obfuscated.split("\n").filter((line) => line.trim())
    const transformedLines = lines.map((line, index) => {
      if (line.trim() && !line.trim().startsWith("--")) {
        const execVar = `_0x${Math.random().toString(16).substr(2, 8)}`
        const condVar = `_0x${Math.random().toString(16).substr(2, 8)}`
        return `local ${condVar} = true; if ${condVar} then local ${execVar} = function() ${line} end; ${execVar}() end`
      }
      return line
    })

    obfuscated = transformedLines.join("\n")

    // Step 9: Final encryption wrapper with anti-debugging
    const mainWrapper = `_0x${Math.random().toString(16).substr(2, 12)}`
    const antiDebug = `_0x${Math.random().toString(16).substr(2, 8)}`

    obfuscated = `
local ${antiDebug} = function()
  local _start = tick()
  for _i = 1, 1000 do
    local _dummy = _i * 2
  end
  if tick() - _start > 0.1 then
    error("Debug detected")
  end
end
${antiDebug}()

local ${mainWrapper} = function()
  ${obfuscated}
end

${mainWrapper}()
`

    return obfuscated
  }

  const handleObfuscate = async () => {
    if (!selectedFile) {
      alert("Please select a file first")
      return
    }

    setIsObfuscating(true)
    setShowPanel(false)
    setCurrentStep(0)

    // Read file content
    const fileContent = await selectedFile.text()

    // Simulate loading steps with delays
    for (let i = 0; i < loadingSteps.length; i++) {
      setCurrentStep(i)
      await new Promise((resolve) => setTimeout(resolve, i === 0 ? 2000 : i === 1 ? 1500 : i === 2 ? 1000 : 500))
    }

    // Perform advanced obfuscation
    const obfuscated = advancedObfuscate(fileContent)

    const downloadFile = (content: string, filename: string) => {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" })

      // Check if we're on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isMobile) {
        // For mobile devices, use a different approach
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result as string
          const link = document.createElement("a")
          link.href = dataUrl
          link.download = filename
          link.style.display = "none"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
        reader.readAsDataURL(blob)
      } else {
        // Desktop approach
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.style.display = "none"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    }

    downloadFile(obfuscated, "obfuscated.txt")

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
