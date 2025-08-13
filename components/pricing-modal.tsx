"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, Zap, Star, BarChart3, Crown } from "lucide-react"

interface PricingPlan {
  id: string
  name: string
  duration: string
  price: string
  gamePassUrl: string
  icon: React.ReactNode
  gradient: string
}

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)

  const plans: PricingPlan[] = [
    {
      id: "1month",
      name: "1 Month",
      duration: "30 Days",
      price: "R$ 250",
      gamePassUrl: "https://www.roblox.com/game-pass/1386962628/1-MONTH-PLAN",
      icon: <Zap className="w-5 h-5" />,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      id: "5months",
      name: "5 Months",
      duration: "150 Days",
      price: "R$ 700",
      gamePassUrl: "https://www.roblox.com/game-pass/1386480582/5-MONTHS-PLAN",
      icon: <Star className="w-5 h-5" />,
      gradient: "from-amber-500 to-yellow-500",
    },
    {
      id: "1year",
      name: "1 Year",
      duration: "365 Days",
      price: "R$ 1,500",
      gamePassUrl: "https://www.roblox.com/game-pass/1386722619/1-YEAR-PLAN",
      icon: <BarChart3 className="w-5 h-5" />,
      gradient: "from-orange-600 to-red-500",
    },
    {
      id: "2years",
      name: "2 Years",
      duration: "730 Days",
      price: "R$ 2,500",
      gamePassUrl: "https://www.roblox.com/game-pass/1386992569/2-YEARS-PLAN",
      icon: <Crown className="w-5 h-5" />,
      gradient: "from-yellow-500 to-orange-500",
    },
  ]

  const handlePurchase = (plan: PricingPlan) => {
    window.open(plan.gamePassUrl, "_blank")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-orange-500 text-orange-500 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-orange-500 text-center">Choose Your Plan</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-black rounded-lg p-4 border border-orange-500 hover:border-orange-400 transition-colors"
            >
              <div className="text-center space-y-3">
                <div className="inline-flex p-2 rounded-lg bg-black border border-orange-500">
                  <div className="text-orange-500">{plan.icon}</div>
                </div>
                <h3 className="font-semibold text-orange-500">{plan.name}</h3>
                <p className="text-sm text-orange-400">{plan.duration}</p>
                <div className="text-xl font-bold text-orange-500">{plan.price}</div>
                <Button
                  onClick={() => handlePurchase(plan)}
                  className="w-full bg-black border border-orange-500 hover:bg-orange-500/10 text-orange-500 text-sm"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Purchase
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black border border-orange-500 rounded-lg p-3 mt-4">
          <p className="text-orange-500 text-xs text-center">
            After purchasing on Roblox, contact support with your transaction ID to activate your plan.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
