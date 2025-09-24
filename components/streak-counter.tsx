"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Calendar } from "lucide-react"

interface StreakCounterProps {
  currentStreak: number
  bestStreak: number
  streakType: string
}

export function StreakCounter({ currentStreak, bestStreak, streakType }: StreakCounterProps) {
  const [animatedStreak, setAnimatedStreak] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStreak(currentStreak)
    }, 500)

    return () => clearTimeout(timer)
  }, [currentStreak])

  return (
    <Card className="border-border/50 bg-gradient-to-br from-accent/5 to-warning/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-foreground">{streakType} Streak</span>
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            <Calendar className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>

        <div className="text-center space-y-2">
          <div
            className={`text-4xl font-bold text-accent transition-all duration-1000 ${
              animatedStreak > 0 ? "scale-110" : "scale-100"
            }`}
          >
            {animatedStreak}
          </div>
          <p className="text-sm text-muted-foreground">{animatedStreak === 1 ? "day" : "days"} in a row</p>

          {bestStreak > currentStreak && (
            <p className="text-xs text-muted-foreground">
              Best: {bestStreak} {bestStreak === 1 ? "day" : "days"}
            </p>
          )}

          {currentStreak >= 7 && (
            <div className="flex justify-center space-x-1 mt-2">
              {[...Array(Math.min(currentStreak, 30))].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-4 rounded-full transition-all duration-300 ${
                    i < currentStreak ? "bg-accent" : "bg-muted"
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
