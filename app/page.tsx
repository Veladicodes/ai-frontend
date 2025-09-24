"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Zap,
  TrendingUp,
  Target,
  Award,
  Brain,
  PiggyBank,
} from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Brain className="w-3 h-3 mr-1" />
                  Financial Tutoring for Gen Z
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                  Master Your Money at{" "}
                  <span className="text-primary">18-25</span>
                </h1>
                <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                  Discover your spending personality through AI-powered analysis. 
                  Get personalized insights, build healthy financial habits, and 
                  unlock your financial potential with gamified learning designed for young adults.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/spending-analysis">
                  <Button size="lg" variant="outline">
                    Analyze Spending
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="lg" variant="outline">
                    Sign Up Free
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Upload CSV & get instant insights</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Discover your spending persona</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/modern-smartphone-showing-financial-app-dashboard-.jpg"
                  alt="Investory App Dashboard"
                  className="w-full max-w-sm mx-auto rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl transform scale-110"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">
              Understand Your Spending Personality
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Upload your transaction data and discover whether you're a Disciplined Planner, 
              Experience Seeker, Spontaneous Spender, or Routine Essentialist. Get personalized 
              insights to improve your financial habits.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Spending Analysis</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Upload your transaction CSV and get instant analysis of your 
                  spending patterns across Survival, Growth, Joy, and Impulse categories.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold">Persona Discovery</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Discover if you're a Disciplined Planner, Experience Seeker, 
                  Spontaneous Spender, or Routine Essentialist with AI-powered clustering.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-info" />
                </div>
                <h3 className="text-lg font-semibold">Financial Fitness</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Track your financial health with gamified challenges, 
                  milestone badges, and progress tracking designed for young adults.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-lg font-semibold">Personalized Insights</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Get tailored recommendations and educational content 
                  based on your unique spending personality and financial goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-balance">
                Ready to Discover Your Spending Personality?
              </h2>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                Join thousands of young adults who are mastering their money 
                with personalized spending insights and financial education.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/spending-analysis" className="flex items-center">
                    Analyze My Spending
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Link href="/dashboard">
                    View Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <PiggyBank className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Investory</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Empowering young adults to master their money through 
                AI-powered spending analysis and personalized financial education.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Demo
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-border/40 mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; 2025 Investory. All rights reserved. Your AI buddy for
              smarter spending.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
