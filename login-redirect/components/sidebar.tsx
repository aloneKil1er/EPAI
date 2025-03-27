"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, UserCircle, Store, Star, Home, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface SidebarProps {
  recentApps: any[]
  onAppClick: (appId: string) => void
}

export function Sidebar({ recentApps, onAppClick }: SidebarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Use a timeout to ensure React is fully initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Don't render full sidebar until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="w-60 bg-white dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col h-full">
        <div className="h-[60px] px-4 border-b dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="w-9 h-9"></div>
        </div>
        <div className="flex-1 p-2">
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-100 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-60 bg-white dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col h-full">
      <div className="h-[60px] px-4 border-b dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">EAI 平台</h2>
        </div>
        <ThemeToggle />
      </div>

      <nav className="flex-1 overflow-auto p-2">
        <ul className="space-y-1">
          <li>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start" data-active={pathname === "/dashboard"}>
                <Home className="mr-2 h-4 w-4" />
                首页
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/chat">
              <Button
                variant="ghost"
                className={`w-full justify-start ${pathname === "/chat" ? "bg-primary/10 text-primary font-medium" : ""}`}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                AI 对话
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/creation">
              <Button
                variant="ghost"
                className={`w-full justify-start ${pathname === "/creation" ? "bg-primary/10 text-primary font-medium" : ""}`}
              >
                <UserCircle className="mr-2 h-4 w-4" />
                应用创作台
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/marketplace">
              <Button
                variant="ghost"
                className={`w-full justify-start ${pathname === "/marketplace" ? "bg-primary/10 text-primary font-medium" : ""}`}
              >
                <Store className="mr-2 h-4 w-4" />
                应用市场
              </Button>
            </Link>
          </li>
        </ul>

        {recentApps && recentApps.length > 0 && (
          <div className="mt-6">
            <h3 className="px-3 text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">最近使用</h3>
            <ul className="space-y-1">
              {recentApps.map((app) => (
                <li key={app.id}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm h-9"
                    onClick={() => onAppClick(app.id)}
                  >
                    <div className="w-4 h-4 mr-2 flex-shrink-0">
                      <img
                        src={app.icon || "/placeholder.svg"}
                        alt=""
                        className="w-full h-full"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=16&width=16"
                        }}
                      />
                    </div>
                    <span className="truncate">{app.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="p-4 border-t dark:border-gray-800">
        <Link href="/favorites">
          <Button variant="ghost" className="w-full justify-start">
            <Star className="mr-2 h-4 w-4" />
            我的收藏
          </Button>
        </Link>
      </div>
    </div>
  )
}
