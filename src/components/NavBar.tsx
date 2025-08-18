"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
}

interface NavBarProps {
  className?: string
}

export function NavBar({ className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState("Intelligence")

  const navItems: NavItem[] = [
    { name: "Intelligence", url: "#intelligence" },
    { name: "Validation", url: "#validation" },
    { name: "Trends", url: "#trends" },
    { name: "Analysis", url: "#analysis" },
  ]

  return (
    <nav className={cn("fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/bd4e78e0-b1da-42f7-b971-1669e9b1e69e.png" 
                alt="theboringdev logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-foreground">theboringdev</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1 bg-muted/50 rounded-full p-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.name

                return (
                  <a
                    key={item.name}
                    href={item.url}
                    onClick={() => setActiveTab(item.name)}
                    className="relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors rounded-full"
                  >
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-background shadow-sm rounded-full -z-10"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </a>
                )
              })}
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Start Reading
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}