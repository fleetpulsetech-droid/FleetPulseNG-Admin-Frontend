"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus } from "lucide-react"
import VehicleTable from "./vehicle-table"
import Toast from "./toast"
import { BASE_URL } from "@/lib/api"

interface User {
  id: number
  email: string
  full_name: string
  is_active: boolean
  created_at: string
}

interface Vehicle {
  id: number
  user_id: number
  sensor_imei: string
  vehicle_vin: string
  vehicle_brand: string
  vehicle_model: string
  vehicle_year: number
  vehicle_color: string
  vehicle_plate_number: string
  vehicle_fuel_type: string
  vehicle_transmission: string
  is_active: boolean
  created_at: string
}

interface ApiResponse<T> {
  responseCode: string
  responseMessage: string
  data: T
}

export default function UserDetails({ user }: { user: User }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchVehicles()
  }, [user.id])

  const fetchVehicles = async () => {
    setLoadingVehicles(true)
    setError("")

    try {
      const response = await fetch(
        `${BASE_URL}/admin/user/${encodeURIComponent(user.email)}/vehicles`,
        {
          headers: { accept: "application/json" },
        },
      )

      const data: ApiResponse<Vehicle[]> = await response.json()

      if (data.responseCode === "00") {
        setVehicles(data.data || [])
      } else {
        setError(data.responseMessage || "Failed to fetch vehicles")
      }
    } catch (err) {
      setError("Failed to load vehicles")
    } finally {
      setLoadingVehicles(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {error && <Toast type="error" message={error} />}

      {/* User Info Card */}
      <Card className="p-6 border border-border bg-card">
        <h2 className="text-lg font-semibold text-foreground mb-4">User Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-foreground font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="text-foreground font-medium">{user.full_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={user.is_active ? "default" : "secondary"}>{user.is_active ? "Active" : "Inactive"}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="text-foreground font-medium">{formatDate(user.created_at)}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Link href={`/reset-password?email=${encodeURIComponent(user.email)}&userId=${user.id}`}>
            <Button variant="outline">Reset User Password</Button>
          </Link>
        </div>
      </Card>

      {/* Vehicles Section */}
      <Card className="p-6 border border-border bg-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Registered Vehicles</h2>
            <p className="text-sm text-muted-foreground mt-1">{vehicles.length} vehicle(s) registered</p>
          </div>
          <Link href={`/register-vehicle?userId=${user.id}&email=${encodeURIComponent(user.email)}`}>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Register New Vehicle
            </Button>
          </Link>
        </div>

        {loadingVehicles ? (
          <div className="text-center py-8 text-muted-foreground">Loading vehicles...</div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No vehicles registered yet</div>
        ) : (
          <VehicleTable vehicles={vehicles} userEmail={user.email} />
        )}
      </Card>
    </div>
  )
}
