"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import type { Goal } from "@/lib/data"

interface GoalProgressAnimationProps {
  goal: Goal
  previousProgress?: number
}

export function GoalProgressAnimation({ goal, previousProgress = 0 }: GoalProgressAnimationProps) {
  const [animatedProgress, setAnimatedProgress] = useState(previousProgress)
  const currentProgress = (goal.current / goal.target) * 100

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(currentProgress)
    }, 300)

    return () => clearTimeout(timer)
  }, [currentProgress])

  const progressDiff = currentProgress - previousProgress

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{goal.title}</span>
        <div className="flex items-center space-x-2">
          {progressDiff > 0 && (
            <span className="text-xs text-success font-medium animate-pulse">+{progressDiff.toFixed(1)}%</span>
          )}
          <span className="text-xs text-muted-foreground">{Math.round(currentProgress)}%</span>
        </div>
      </div>
      <Progress
        value={animatedProgress}
        className={`h-3 transition-all duration-1000 ease-out ${progressDiff > 0 ? "shadow-lg shadow-success/20" : ""}`}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>₹{goal.current.toLocaleString()}</span>
        <span>₹{goal.target.toLocaleString()}</span>
      </div>
    </div>
  )
}
