"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Shield,
  Calendar,
  LogOut,
  Coins,
  Check,
  Star,
  Zap,
  Crown,
  ExternalLink,
  Users,
  Lock,
  BarChart3,
} from "lucide-react"

interface PricingPlan {
  id: string
  name: string
  duration: string
  price: string
  gamePassUrl: string
  features: string[]
  popular?: boolean
  icon: React.ReactNode
  gradient: string
}

export default function PricingPage() {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)
  const [keyExpiry, setKeyExpiry] = useState("")
  const [currentTime, setCurrentTime] = useState("")
  const router = useRouter()

  const plans: PricingPlan[] = [
    {
      id: "1month",
      name: "Starter",
      duration: "1 Month",
      price: "R$ 250", // Updated from R$ 99 to R$ 250
      gamePassUrl: "https://www.roblox.com/game-pass/1386962628/1-MONTH-PLAN",
      features: [
        "Unlimited script protection",
        "Basic user management",
        "Real-time analytics",
        "24/7 support",
        "Raw link protection",
      ],
      icon: <Zap className="w-6 h-6" />,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      id: "5months",
      name: "Popular",
      duration: "5 Months",
      price: "R$ 700", // Updated from R$ 399 to R$ 700
      gamePassUrl: "https://www.roblox.com/game-pass/1386480582/5-MONTHS-PLAN",
      features: [
        "Everything in Starter",
        "Advanced whitelist/blacklist",
        "Priority support",
        "Custom script obfuscation",
        "Detailed execution logs",
        "Extended key duration",
      ],
      popular: true,
      icon: <Star className="w-6 h-6" />,
      gradient: "from-amber-500 to-yellow-500",
    },
    {
      id: "1year",
      name: "Professional",
      duration: "1 Year",
      price: "R$ 1,500", // Updated from R$ 799 to R$ 1,500
      gamePassUrl: "https://www.roblox.com/game-pass/1386722619/1-YEAR-PLAN",
      features: [
        "Everything in Popular",
        "Advanced analytics dashboard",
        "Custom branding options",
        "API access",
        "Bulk user management",
        "Long-lasting key protection",
      ],
      icon: <BarChart3 className="w-6 h-6" />,
      gradient: "from-orange-600 to-red-500",
    },
    {
      id: "2years",
      name: "Enterprise",
      duration: "2 Years",
      price: "R$ 2,500", // Updated from R$ 1299 to R$ 2,500
      gamePassUrl: "https://www.roblox.com/game-pass/1386992569/2-YEARS-PLAN",
      features: [
        "Everything in Professional",
        "Dedicated support agent",
        "Custom integrations",
        "White-label solutions",
        "Advanced security features",
        "Maximum key duration",
      ],
      icon: <Crown className="w-6 h-6" />,
      gradient: "from-yellow-500 to-orange-500",
    },
  ]

  useEffect(() => {
    // Check authentication
    const userType = localStorage.getItem("userType")
    const currentKey = localStorage.getItem("currentKey")
    if (!userType || !currentKey) {
      router.push("/")
      return
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

  const handlePurchase = (plan: PricingPlan) => {
    setSelectedPlan(plan)
    setShowPurchaseModal(true)
  }

  const openGamePass = () => {
    if (selectedPlan) {
      window.open(selectedPlan.gamePassUrl, "_blank")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("currentKey")
    localStorage.removeItem("keyExpiry")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-sm border-b border-orange-500/30 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-orange-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              LuaGuard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Calendar className="w-4 h-4" />
              <span>Expires: {keyExpiry}</span>
            </div>
            <div className="text-sm text-slate-400">{currentTime}</div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-500/50 text-red-300 hover:bg-red-500/10 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-800/60 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              className="text-slate-300 hover:text-orange-100 hover:bg-orange-500/10"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => router.push("/projects")}
              variant="ghost"
              className="text-slate-300 hover:text-orange-100 hover:bg-orange-500/10"
            >
              Projects
            </Button>
            <Button
              onClick={() => router.push("/settings")}
              variant="ghost"
              className="text-slate-300 hover:text-orange-100 hover:bg-orange-500/10"
            >
              Settings
            </Button>
            <Button variant="ghost" className="text-orange-300 hover:text-orange-100 hover:bg-orange-500/10">
              Pricing
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Upgrade your LuaGuard experience with advanced features and extended protection
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative bg-slate-800/60 backdrop-blur-sm border-slate-700/50 p-6 transition-all duration-300 hover:scale-105 ${
                  plan.popular ? "ring-2 ring-orange-500/50 shadow-lg shadow-orange-500/20" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Plan Header */}
                  <div className="text-center space-y-2">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${plan.gradient} bg-opacity-20`}>
                      <div className="text-white">{plan.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold text-orange-100">{plan.name}</h3>
                    <p className="text-slate-400">{plan.duration}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{plan.price}</div>
                    <p className="text-sm text-slate-400">One-time payment</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Purchase Button */}
                  <Button
                    onClick={() => handlePurchase(plan)}
                    className={`w-full bg-gradient-to-r ${plan.gradient} hover:opacity-90 text-white font-semibold`}
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Purchase Plan
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Features Comparison */}
          <Card className="bg-slate-800/60 backdrop-blur-sm border-slate-700/50 p-8">
            <h3 className="text-2xl font-bold text-orange-100 mb-6 text-center">Why Choose LuaGuard?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="p-4 bg-orange-500/20 rounded-lg inline-block">
                  <Lock className="w-8 h-8 text-orange-400" />
                </div>
                <h4 className="text-lg font-semibold text-orange-100">Advanced Protection</h4>
                <p className="text-slate-400">
                  Military-grade script obfuscation and anti-tampering protection for your Lua scripts
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="p-4 bg-amber-500/20 rounded-lg inline-block">
                  <Users className="w-8 h-8 text-amber-400" />
                </div>
                <h4 className="text-lg font-semibold text-amber-100">User Management</h4>
                <p className="text-slate-400">
                  Comprehensive whitelist and blacklist system with real-time user access control
                </p>
              </div>

              <div className="text-center space-y-3">
                <div className="p-4 bg-yellow-500/20 rounded-lg inline-block">
                  <BarChart3 className="w-8 h-8 text-yellow-400" />
                </div>
                <h4 className="text-lg font-semibold text-yellow-100">Real-time Analytics</h4>
                <p className="text-slate-400">
                  Detailed execution tracking and comprehensive analytics dashboard for your scripts
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Purchase Modal */}
      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="bg-slate-800 border-orange-500/30 text-orange-100">
          <DialogHeader>
            <DialogTitle className="text-orange-100 text-center">Complete Your Purchase</DialogTitle>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className={`inline-flex p-4 rounded-lg bg-gradient-to-r ${selectedPlan.gradient} bg-opacity-20`}>
                  <div className="text-white">{selectedPlan.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-white">{selectedPlan.name} Plan</h3>
                <p className="text-slate-300">{selectedPlan.duration}</p>
                <div className="text-3xl font-bold text-white">{selectedPlan.price}</div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <h4 className="font-semibold text-orange-100 mb-2">What you'll get:</h4>
                <div className="space-y-1">
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-200 text-sm text-center">
                  You will be redirected to Roblox to complete your purchase. After purchasing, contact support with
                  your transaction ID to activate your plan.
                </p>
              </div>

              <Button
                onClick={openGamePass}
                className={`w-full bg-gradient-to-r ${selectedPlan.gradient} hover:opacity-90 text-white font-semibold py-3`}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Purchase on Roblox
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
