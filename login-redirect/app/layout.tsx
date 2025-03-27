import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { ThemeInitializer } from "@/components/theme-initializer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>EAI 平台</title>
      </head>
      <body suppressHydrationWarning>
        {children}
        <ThemeInitializer />
        <Toaster />
      </body>
    </html>
  )
}

export const metadata = {
  generator: 'v0.dev'
};