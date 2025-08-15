"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, AlertTriangle, Clock, Globe } from "lucide-react"

interface UnauthorizedAttempt {
  ip: string
  timestamp: string
  key: string
}

export default function IPsPage() {
  const [userType, setUserType] = useState<"user" | "owner" | null>(null)
  const [unauthorizedAttempts, setUnauthorizedAttempts] = useState<UnauthorizedAttempt[]>([])
  const [ownerIP, setOwnerIP] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const storedUserType = localStorage.getItem("userType") as "user" | "owner" | null
    const storedKey = localStorage.getItem("currentKey")

    if (!storedUserType || !storedKey || storedUserType !== "owner") {
      router.push("/")
      return
    }

    setUserType(storedUserType)

    // Load unauthorized attempts
    const attempts = JSON.parse(localStorage.getItem("unauthorizedAttempts") || "[]")
    setUnauthorizedAttempts(attempts)

    // Load owner IP
    const ownerIPAddress = localStorage.getItem("ownerIP") || "Not set"
    setOwnerIP(ownerIPAddress)
  }, [router])

  const clearAttempts = () => {
    localStorage.removeItem("unauthorizedAttempts")
    setUnauthorizedAttempts([])
  }

  if (!userType || userType !== "owner") {
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
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              size="sm"
              className="text-orange-400 hover:text-orange-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Shield className="w-8 h-8 text-orange-400" />
            <h1 className="text-2xl font-bold text-orange-400">IP Security Monitor</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-orange-400 mb-2">IP Address Monitoring</h2>
            <p className="text-orange-400">Monitor unauthorized login attempts to your owner account</p>
          </div>

          {/* Owner IP Info */}
          <Card className="bg-black border-orange-500 p-6">
            <div className="flex items-center gap-4 mb-4">
              <Globe className="w-6 h-6 text-orange-400" />
              <h3 className="text-xl font-semibold text-orange-400">Your Authorized IP</h3>
            </div>
            <div className="bg-black/50 border border-orange-500/30 rounded-lg p-4">
              <p className="text-orange-400 font-mono text-lg">{ownerIP}</p>
              <p className="text-orange-400/60 text-sm mt-1">Only this IP address can access the owner account</p>
            </div>
          </Card>

          {/* Unauthorized Attempts */}
          <Card className="bg-black border-orange-500 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
                <h3 className="text-xl font-semibold text-orange-400">Unauthorized Login Attempts</h3>
              </div>
              {unauthorizedAttempts.length > 0 && (
                <Button
                  onClick={clearAttempts}
                  className="bg-black border border-orange-500 text-orange-400 hover:bg-orange-500/10"
                >
                  Clear All
                </Button>
              )}
            </div>

            {unauthorizedAttempts.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-orange-400/50 mx-auto mb-4" />
                <p className="text-orange-400/60">No unauthorized attempts detected</p>
                <p className="text-orange-400/40 text-sm mt-1">Your owner account is secure</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unauthorizedAttempts.map((attempt, index) => (
                  <div
                    key={index}
                    className="bg-black/50 border border-orange-500/30 rounded-lg p-4 hover:border-orange-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-orange-400 font-mono text-lg">{attempt.ip}</p>
                          <p className="text-orange-400/60 text-sm">Attempted to use owner key</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-orange-400/60">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{attempt.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Security Info */}
          <Card className="bg-black border-orange-500 p-6">
            <h3 className="text-xl font-semibold text-orange-400 mb-4">Security Information</h3>
            <div className="space-y-3 text-orange-400/80">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Only your registered IP address can access the owner account</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>All unauthorized login attempts are logged with IP address and timestamp</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Unauthorized users receive a denial message and cannot access the account</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
