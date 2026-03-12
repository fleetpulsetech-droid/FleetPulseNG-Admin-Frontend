"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle, X } from "lucide-react"

interface ToastProps {
  type: "success" | "error"
  message: string
  duration?: number
}

export default function Toast({ type, message, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  const isSuccess = type === "success"
  const bgColor = isSuccess ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
  const textColor = isSuccess ? "text-green-800" : "text-red-800"
  const Icon = isSuccess ? CheckCircle : AlertCircle

  return (
    <div
      className={`fixed top-4 right-4 max-w-md ${bgColor} border rounded-lg shadow-lg p-4 flex items-start gap-3 z-50`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${textColor}`} />
      <div className="flex-1">
        <p className={`text-sm font-medium ${textColor}`}>{message}</p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className={`flex-shrink-0 ${textColor} hover:opacity-75 transition-opacity`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
