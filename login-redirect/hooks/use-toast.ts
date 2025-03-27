// 这是一个简化版的 use-toast hooks，提供基础的 toast 通知功能
// 实际项目中可能会用更完整的 toast 系统

import { useState } from "react"

export type ToastProps = {
  title?: string
  description?: string
  type?: "default" | "success" | "error" | "warning" | "info"
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export type Toast = ToastProps & {
  id: string
  visible: boolean
}

export type ToasterToast = ToastProps & {
  id: string
  onOpenChange?: (open: boolean) => void
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000

type ToastActionType = {
  toast: (props: ToastProps) => void
  dismiss: (toastId?: string) => void
  toasts: ToasterToast[]
}

export const useToast = (): ToastActionType => {
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  function dismiss(toastId?: string) {
    setToasts((toasts) => {
      if (toastId) {
        const updatedToasts = toasts.map((t) => {
          if (t.id === toastId) {
            return {
              ...t,
              onOpenChange: (open) => {
                if (!open) {
                  setTimeout(() => {
                    setToasts((toasts) => toasts.filter((t) => t.id !== toastId))
                  }, TOAST_REMOVE_DELAY)
                }
              },
            }
          }
          return t
        })
        return updatedToasts
      }
      
      // 如果没有传入 toastId，关闭所有 toast
      return toasts.map((t) => ({
        ...t,
        onOpenChange: (open) => {
          if (!open) {
            setTimeout(() => {
              setToasts([])
            }, TOAST_REMOVE_DELAY)
          }
        },
      }))
    })
  }

  function toast({ title, description, type = "default", duration = 5000, action }: ToastProps) {
    const id = crypto.randomUUID()
    const newToast = {
      id,
      title,
      description,
      type,
      duration,
      action,
    }

    setToasts((toasts) => {
      const updatedToasts = [newToast, ...toasts].slice(0, TOAST_LIMIT)
      return updatedToasts
    })

    // 自动关闭逻辑
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }

  return {
    toast,
    dismiss,
    toasts,
  }
}