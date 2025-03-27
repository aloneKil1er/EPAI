"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Eye } from "lucide-react"

interface AppCardProps {
  app: {
    id: string
    name: string
    icon: string
    description: string
    usageCount: number
    tags: string[]
  }
  onAppClick: (appId: string) => void
}

export function AppCard({ app, onAppClick }: AppCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10">
            {/* 使用图片或图标 */}
            <img
              src={app.icon || "/placeholder.svg"}
              alt={app.name}
              className="w-8 h-8"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=32&width=32"
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate">{app.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Eye className="h-3.5 w-3.5 mr-1" />
                <span>{app.usageCount}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{app.description}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-2 pt-0 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="h-8" onClick={() => onAppClick(app.id)}>
          立即使用
        </Button>

        {app.tags.slice(0, 2).map((tag) => (
          <Button key={tag} variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground">
            {tag}
          </Button>
        ))}
      </CardFooter>
    </Card>
  )
}
