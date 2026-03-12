"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"
import UserDetails from "@/components/user-details"
import Toast from "@/components/toast"
import { useSearchParams } from "next/navigation"

interface User {
  id: number
  email: string
  full_name: string
  is_active: boolean
  created_at: string
}

interface ApiResponse<T> {
  responseCode: string
  responseMessage: string
  data: T
}

export default function DashboardContent() {
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get("email") || ""

  const [email, setEmail] = useState(initialEmail)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`https://fleetpulse-latest.onrender.com/admin/user/${encodeURIComponent(email)}`, {
        headers: { accept: "application/json" },
      })

      const data: ApiResponse<User> = await response.json()

      if (data.responseCode === "00") {
        setUserData(data.data)
        setSuccess("User found successfully")
      } else {
        setError(data.responseMessage || "Failed to fetch user")
        setUserData(null)
      }
    } catch (err) {
      setError("Failed to search user. Please try again.")
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setEmail("")
    setUserData(null)
    setError("")
    setSuccess("")
  }

  return (
    <main className="min-h-screen bg-background">
      {success && <Toast type="success" message={success} />}
      {error && <Toast type="error" message={error} />}

      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-foreground">FleetPulse Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage users and their registered vehicles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Search User</h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter user email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !email}>
                <Search className="w-4 h-4 mr-2" />
                {loading ? "Searching..." : "Search"}
              </Button>
              {userData && (
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              )}
            </form>
          </Card>
        </div>

        {/* User Details and Vehicles */}
        {userData && <UserDetails user={userData} />}
      </div>
    </main>
  )
}
