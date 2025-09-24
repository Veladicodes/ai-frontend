"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  PiggyBank,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  Bell,
  Target,
  Award,
  BarChart3,
  PieChart,
} from "lucide-react"
import {
  sampleTransactions,
  sampleAITips,
  sampleGoals,
  sampleBadges,
  formatCurrency,
  getCategoryColor,
  getSpendingByCategory,
} from "@/lib/data"
import { SpendingPieChart } from "@/components/charts/spending-pie-chart"
import { SpendingTrendChart } from "@/components/charts/spending-trend-chart"
import { AINudgePopup } from "@/components/ai-nudge-popup"
import { BadgeUnlockAnimation } from "@/components/badge-unlock-animation"
import { GoalProgressAnimation } from "@/components/goal-progress-animation"
import { StreakCounter } from "@/components/streak-counter"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const [showNudge, setShowNudge] = useState(false)
  const [showBadgeUnlock, setShowBadgeUnlock] = useState(false)
  const [currentNudge, setCurrentNudge] = useState<(typeof sampleAITips)[0] | null>(null)
  const [unlockedBadge, setUnlockedBadge] = useState<(typeof sampleBadges)[0] | null>(null)

  const transactions = sampleTransactions
  const aiTips = sampleAITips
  const goals = sampleGoals
  const badges = sampleBadges

  // Calculate spending metrics
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const spendingByCategory = getSpendingByCategory(transactions)
  const topCategories = Object.entries(spendingByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)

  const currentMonth = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })

  // Demo functionality for AI nudges and badge unlocks
  useEffect(() => {
    // Show AI nudge after 3 seconds
    const nudgeTimer = setTimeout(() => {
      setCurrentNudge(aiTips[0])
      setShowNudge(true)
    }, 3000)

    // Show badge unlock after 8 seconds
    const badgeTimer = setTimeout(() => {
      const earnedBadge = badges.find((b) => b.earned)
      if (earnedBadge) {
        setUnlockedBadge(earnedBadge)
        setShowBadgeUnlock(true)
      }
    }, 8000)

    return () => {
      clearTimeout(nudgeTimer)
      clearTimeout(badgeTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <PiggyBank className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Investory</span>
            </Link>
            <Badge variant="secondary" className="hidden sm:flex">
              <Calendar className="w-3 h-3 mr-1" />
              {currentMonth}
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary">A</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Balance</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalIncome - totalExpenses)}</p>
                  <p className="text-sm text-success flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12.5% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalExpenses)}</p>
                  <p className="text-sm text-warning flex items-center mt-1">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    +8.2% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Savings Goal</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(goals[0]?.current || 0)}</p>
                  <p className="text-sm text-info flex items-center mt-1">
                    <Target className="w-3 h-3 mr-1" />
                    {Math.round(((goals[0]?.current || 0) / (goals[0]?.target || 1)) * 100)}% of target
                  </p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>Spending by Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingPieChart data={spendingByCategory} />
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Spending Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingTrendChart transactions={transactions} />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Tips Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-xs">🤖</span>
                  </div>
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiTips.slice(0, 3).map((tip) => (
                  <div key={tip.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-foreground leading-relaxed">{tip.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(tip.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`ml-3 ${
                          tip.type === "saving"
                            ? "bg-success/10 text-success"
                            : tip.type === "warning"
                              ? "bg-warning/10 text-warning"
                              : tip.type === "achievement"
                                ? "bg-primary/10 text-primary"
                                : "bg-info/10 text-info"
                        }`}
                      >
                        {tip.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Transactions</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 8).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(transaction.category)}`}
                        >
                          {transaction.type === "expense" ? (
                            <ArrowDownRight className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">{transaction.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold text-sm ${
                            transaction.type === "expense" ? "text-destructive" : "text-success"
                          }`}
                        >
                          {transaction.type === "expense" ? "-" : "+"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Streak Counter */}
            <StreakCounter currentStreak={7} bestStreak={12} streakType="Savings" />

            {/* Top Categories */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Top Spending Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topCategories.map(([category, amount]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{category}</span>
                      <span className="text-sm text-muted-foreground">{formatCurrency(amount)}</span>
                    </div>
                    <Progress value={(amount / totalExpenses) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Goals Progress */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Goals Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.slice(0, 3).map((goal) => (
                  <GoalProgressAnimation key={goal.id} goal={goal} previousProgress={15} />
                ))}
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        badge.earned ? "bg-success/5 border-success/20" : "bg-muted/20 border-border/50 opacity-60"
                      }`}
                    >
                      <div className="text-2xl mb-1">{badge.icon}</div>
                      <p className="text-xs font-medium text-foreground">{badge.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Nudge Popup and Badge Unlock Animation */}
      {showNudge && currentNudge && (
        <AINudgePopup
          tip={currentNudge}
          onClose={() => setShowNudge(false)}
          onAction={() => {
            setShowNudge(false)
            // Handle action logic here
          }}
        />
      )}

      {showBadgeUnlock && unlockedBadge && (
        <BadgeUnlockAnimation badge={unlockedBadge} onClose={() => setShowBadgeUnlock(false)} />
      )}
    </div>
  )
}
