"use client"

import { type ReactNode, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { UserProfile } from "@/components/user-profile"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface UserSpaceLayoutProps {
  children: ReactNode
  title: string
  backUrl?: string
}

export function UserSpaceLayout({ children, title, backUrl = "/marketplace" }: UserSpaceLayoutProps) {
  const router = useRouter()
  const [recentApps, setRecentApps] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  // Initialize on mount
  useEffect(() => {
    setMounted(true)

    try {
      const storedApps = localStorage.getItem("recentApps")
      if (storedApps) {
        setRecentApps(JSON.parse(storedApps))
      }
    } catch (e) {
      console.error("Failed to parse recent apps", e)
    }
  }, [])

  const handleAppClick = (appId: string) => {
    router.push(`/app/${appId}`)
  }

  // Show a simple loading state until mounted
  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div>加载中...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* 左侧边栏 */}
      <Sidebar recentApps={recentApps} onAppClick={handleAppClick} />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center h-[60px] px-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(backUrl)} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h1>

          <div className="ml-auto">
            <UserProfile />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
