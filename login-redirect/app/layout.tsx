import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { ThemeInitializer } from "@/components/theme-initializer"

export const metadata = {
  title: 'EAI 平台',
  description: 'EAI 应用平台 - 您的AI助手集成中心',
  generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ThemeInitializer />
        <Toaster />
      </body>
    </html>
  )
}
