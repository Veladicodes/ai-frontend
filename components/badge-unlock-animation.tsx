"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Sparkles } from "lucide-react"
import type { Badge as BadgeType } from "@/lib/data"

interface BadgeUnlockAnimationProps {
  badge: BadgeType
  onClose: () => void
}

export function BadgeUnlockAnimation({ badge, onClose }: BadgeUnlockAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 100)
    const timer2 = setTimeout(() => setShowConfetti(true), 300)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <Card
        className={`w-full max-w-sm border-2 border-success/20 bg-success/5 shadow-2xl transform transition-all duration-700 ease-out ${
          isVisible ? "scale-100 opacity-100 rotate-0" : "scale-50 opacity-0 rotate-12"
        }`}
      >
        <CardContent className="p-8 text-center relative overflow-hidden">
          {/* Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${1 + Math.random()}s`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="flex justify-end mb-4">
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-success mr-2" />
              <Badge variant="secondary" className="bg-success/10 text-success">
                Achievement Unlocked!
              </Badge>
            </div>

            <div
              className={`text-6xl mb-4 transform transition-all duration-1000 ${
                isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"
              }`}
            >
              {badge.icon}
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">{badge.title}</h3>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </div>

            <Button onClick={onClose} className="w-full bg-success hover:bg-success/90">
              Awesome!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
