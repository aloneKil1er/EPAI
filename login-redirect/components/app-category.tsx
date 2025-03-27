import { AppCard } from "./app-card"

interface AppCategoryProps {
  title: string
  description?: string
  apps: any[]
  onAppClick: (appId: string) => void
}

export function AppCategory({ title, description, apps, onAppClick }: AppCategoryProps) {
  if (apps.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      {description && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} onAppClick={onAppClick} />
        ))}
      </div>
    </div>
  )
}
