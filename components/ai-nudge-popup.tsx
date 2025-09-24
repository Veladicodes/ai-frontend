"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Lightbulb, TrendingUp, AlertTriangle, Trophy } from "lucide-react"
import type { AITip } from "@/lib/data"

interface AINudgePopupProps {
  tip: AITip
  onClose: () => void
  onAction?: () => void
}

export function AINudgePopup({ tip, onClose, onAction }: AINudgePopupProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const getIcon = () => {
    switch (tip.type) {
      case "saving":
        return <Lightbulb className="w-5 h-5" />
      case "investment":
        return <TrendingUp className="w-5 h-5" />
      case "warning":
        return <AlertTriangle className="w-5 h-5" />
      case "achievement":
        return <Trophy className="w-5 h-5" />
      default:
        return <Lightbulb className="w-5 h-5" />
    }
  }

  const getColors = () => {
    switch (tip.type) {
      case "saving":
        return "bg-success/10 text-success border-success/20"
      case "investment":
        return "bg-primary/10 text-primary border-primary/20"
      case "warning":
        return "bg-warning/10 text-warning border-warning/20"
      case "achievement":
        return "bg-accent/10 text-accent border-accent/20"
      default:
        return "bg-info/10 text-info border-info/20"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <Card
        className={`w-full max-w-md border-2 shadow-2xl pointer-events-auto transform transition-all duration-500 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-full opacity-0 scale-95"
        } ${getColors()}`}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getColors()}`}>{getIcon()}</div>
              <div>
                <Badge variant="secondary" className={getColors()}>
                  AI Tip
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-foreground leading-relaxed mb-4">{tip.message}</p>

          {tip.amount && (
            <div className="bg-background/50 rounded-lg p-3 mb-4">
              <p className="text-xs text-muted-foreground">Potential Impact</p>
              <p className="text-lg font-bold text-foreground">₹{tip.amount.toLocaleString()}</p>
            </div>
          )}

          <div className="flex space-x-2">
            {onAction && (
              <Button size="sm" className="flex-1" onClick={onAction}>
                Take Action
              </Button>
            )}
            <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={onClose}>
              Got it
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
