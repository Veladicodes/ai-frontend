export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: string
  type: "expense" | "income"
}

export interface AITip {
  id: string
  message: string
  type: "saving" | "investment" | "warning" | "achievement"
  amount?: number
  category?: string
  timestamp: string
}

export interface Goal {
  id: string
  title: string
  target: number
  current: number
  category: string
  deadline: string
}

export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
}

// Sample transaction data
export const sampleTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-01-24",
    description: "Swiggy Food Delivery",
    amount: 250,
    category: "Food & Dining",
    type: "expense",
  },
  {
    id: "2",
    date: "2025-01-24",
    description: "Zomato Order",
    amount: 180,
    category: "Food & Dining",
    type: "expense",
  },
  {
    id: "3",
    date: "2025-01-23",
    description: "Netflix Subscription",
    amount: 199,
    category: "Entertainment",
    type: "expense",
  },
  {
    id: "4",
    date: "2025-01-23",
    description: "Uber Ride",
    amount: 120,
    category: "Transportation",
    type: "expense",
  },
  {
    id: "5",
    date: "2025-01-22",
    description: "Starbucks Coffee",
    amount: 350,
    category: "Food & Dining",
    type: "expense",
  },
  {
    id: "6",
    date: "2025-01-22",
    description: "Amazon Purchase",
    amount: 899,
    category: "Shopping",
    type: "expense",
  },
  {
    id: "7",
    date: "2025-01-21",
    description: "Salary Credit",
    amount: 45000,
    category: "Income",
    type: "income",
  },
  {
    id: "8",
    date: "2025-01-21",
    description: "Myntra Shopping",
    amount: 1200,
    category: "Shopping",
    type: "expense",
  },
  {
    id: "9",
    date: "2025-01-20",
    description: "Gym Membership",
    amount: 1500,
    category: "Health & Fitness",
    type: "expense",
  },
  {
    id: "10",
    date: "2025-01-20",
    description: "BookMyShow Tickets",
    amount: 400,
    category: "Entertainment",
    type: "expense",
  },
  {
    id: "11",
    date: "2025-01-19",
    description: "Grocery Shopping",
    amount: 850,
    category: "Food & Dining",
    type: "expense",
  },
  {
    id: "12",
    date: "2025-01-19",
    description: "Petrol",
    amount: 500,
    category: "Transportation",
    type: "expense",
  },
  {
    id: "13",
    date: "2025-01-18",
    description: "Online Course",
    amount: 999,
    category: "Education",
    type: "expense",
  },
  {
    id: "14",
    date: "2025-01-18",
    description: "Coffee Shop",
    amount: 150,
    category: "Food & Dining",
    type: "expense",
  },
  {
    id: "15",
    date: "2025-01-17",
    description: "Medicine",
    amount: 320,
    category: "Health & Fitness",
    type: "expense",
  },
]

// Sample AI tips
export const sampleAITips: AITip[] = [
  {
    id: "1",
    message: "Hey! Skipping 2 Zomato orders this week → ₹500 saved. Put it in micro-investment! 🎉",
    type: "saving",
    amount: 500,
    category: "Food & Dining",
    timestamp: "2025-01-24T10:30:00Z",
  },
  {
    id: "2",
    message: "You've spent ₹780 on food delivery this week. Consider meal prep to save ₹400+ monthly!",
    type: "warning",
    amount: 780,
    category: "Food & Dining",
    timestamp: "2025-01-24T09:15:00Z",
  },
  {
    id: "3",
    message: "Great job! You're 15% under budget this month. Invest the extra ₹2,250 in SIP!",
    type: "achievement",
    amount: 2250,
    timestamp: "2025-01-23T16:45:00Z",
  },
  {
    id: "4",
    message: "Coffee spending alert: ₹1,050 this month. Try home brewing to save ₹700!",
    type: "saving",
    amount: 700,
    category: "Food & Dining",
    timestamp: "2025-01-23T11:20:00Z",
  },
]

// Sample goals
export const sampleGoals: Goal[] = [
  {
    id: "1",
    title: "Emergency Fund",
    target: 50000,
    current: 12500,
    category: "Savings",
    deadline: "2025-06-30",
  },
  {
    id: "2",
    title: "Vacation Fund",
    target: 25000,
    current: 8750,
    category: "Travel",
    deadline: "2025-05-15",
  },
  {
    id: "3",
    title: "Reduce Food Delivery",
    target: 2000,
    current: 1220,
    category: "Budget",
    deadline: "2025-02-28",
  },
]

// Sample badges
export const sampleBadges: Badge[] = [
  {
    id: "1",
    title: "Savings Streak",
    description: "Saved money for 7 consecutive days",
    icon: "🔥",
    earned: true,
    earnedDate: "2025-01-20",
  },
  {
    id: "2",
    title: "Budget Master",
    description: "Stayed under budget for a full month",
    icon: "🎯",
    earned: true,
    earnedDate: "2025-01-15",
  },
  {
    id: "3",
    title: "Investment Rookie",
    description: "Made your first micro-investment",
    icon: "📈",
    earned: false,
  },
  {
    id: "4",
    title: "Coffee Saver",
    description: "Reduced coffee spending by 50%",
    icon: "☕",
    earned: false,
  },
]

// Utility functions
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "Food & Dining": "bg-warning/10 text-warning",
    Entertainment: "bg-info/10 text-info",
    Transportation: "bg-accent/10 text-accent",
    Shopping: "bg-destructive/10 text-destructive",
    "Health & Fitness": "bg-success/10 text-success",
    Income: "bg-primary/10 text-primary",
    Savings: "bg-success/10 text-success",
    Travel: "bg-info/10 text-info",
    Budget: "bg-warning/10 text-warning",
    Education: "bg-info/10 text-info",
  }
  return colors[category] || "bg-muted/10 text-muted-foreground"
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getSpendingByCategory(transactions: Transaction[]): Record<string, number> {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
        return acc
      },
      {} as Record<string, number>,
    )
}
