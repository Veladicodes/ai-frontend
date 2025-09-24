"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, LogOut, User, Settings, Calendar, Bell, Download, BarChart3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Navigation() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log("Navigation - Session status:", status);
    console.log("Navigation - Session data:", session);
    if (session?.user?.image) {
      console.log("Navigation - User image URL:", session.user.image);
    }
  }, [session, status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    setShowDropdown(false);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Investory</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#demo"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Demo
          </Link>
          <Link
            href="#about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          {session && (
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          {status === "loading" ? (
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
          ) : session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-muted/50 transition-colors"
              >
                {session.user?.image ? (
                    <img
                      src={`/api/proxy-image?url=${encodeURIComponent(session.user.image)}`}
                      alt={session.user?.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-primary/20"
                      onError={(e) => {
                        console.error("Image failed to load:", session.user?.image);
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        // Show fallback
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      onLoad={() => {
                        console.log("Image loaded successfully:", session.user?.image);
                      }}
                    />
                  ) : null}
                  {/* Fallback avatar - always present but hidden when image loads */}
                  <div 
                    className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20"
                    style={{ display: session.user?.image ? 'none' : 'flex' }}
                  >
                    <User className="w-4 h-4 text-primary" />
                  </div>
                <span className="hidden sm:block text-sm font-medium">
                  {session.user?.name?.split(" ")[0] || "User"}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  
                  <Link
                    href="/spending-analysis"
                    className="flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Spending Analysis
                  </Link>
                  
                  <hr className="my-1 border-border" />
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function DashboardNavigation() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    setShowDropdown(false);
    await signOut({ callbackUrl: "/" });
  };

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Investory
            </span>
          </Link>
          <Badge variant="secondary" className="hidden sm:flex">
            <Calendar className="w-3 h-3 mr-1" />
            {currentMonth}
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cluster">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Cluster Analysis</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
          
          {session && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-muted/50 transition-colors"
              >
                {session.user?.image ? (
                    <img
                      src={`/api/proxy-image?url=${encodeURIComponent(session.user.image)}`}
                      alt={session.user?.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                      onError={(e) => {
                        console.error("Dashboard image failed to load:", session.user?.image);
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        // Show fallback
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      onLoad={() => {
                        console.log("Dashboard image loaded successfully:", session.user?.image);
                      }}
                    />
                  ) : null}
                  {/* Fallback avatar - always present but hidden when image loads */}
                  <div 
                    className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                    style={{ display: session.user?.image ? 'none' : 'flex' }}
                  >
                    <span className="text-sm font-medium text-primary-foreground">
                      {session.user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-foreground">
                    {session.user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.user?.email}
                  </p>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  
                  <Link
                    href="/spending-analysis"
                    className="flex items-center px-3 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Spending Analysis
                  </Link>
                  
                  <hr className="my-1 border-border" />
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}