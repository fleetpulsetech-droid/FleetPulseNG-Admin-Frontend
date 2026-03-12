"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Toast from "@/components/toast"
import { useSearchParams } from "next/navigation"

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

export default function EditVehicleContent() {
  const searchParams = useSearchParams()
  const vehicleIdFromParams = searchParams.get("vehicleId") || ""
  const userEmailFromParams = searchParams.get("userEmail") || ""

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState({
    vehicle_brand: "",
    vehicle_model: "",
    vehicle_year: new Date().getFullYear(),
    vehicle_color: "#000000",
    vehicle_plate_number: "",
    vehicle_fuel_type: "Gasoline",
    vehicle_transmission: "Automatic",
    is_active: true,
  })

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchVehicle()
  }, [vehicleIdFromParams])

  const fetchVehicle = async () => {
    if (!vehicleIdFromParams) {
      setLoadingData(false)
      return
    }

    setLoadingData(true)
    try {
      // Fetch from vehicles list using email
      const response = await fetch(
        `https://fleetpulse-latest.onrender.com/admin/user/${encodeURIComponent(userEmailFromParams)}/vehicles`,
        {
          headers: { accept: "application/json" },
        },
      )

      const data: ApiResponse<Vehicle[]> = await response.json()

      if (data.responseCode === "00" && data.data) {
        const foundVehicle = data.data.find((v) => v.id === Number.parseInt(vehicleIdFromParams))
        if (foundVehicle) {
          setVehicle(foundVehicle)
          setFormData({
            vehicle_brand: foundVehicle.vehicle_brand,
            vehicle_model: foundVehicle.vehicle_model,
            vehicle_year: foundVehicle.vehicle_year,
            vehicle_color: foundVehicle.vehicle_color,
            vehicle_plate_number: foundVehicle.vehicle_plate_number,
            vehicle_fuel_type: foundVehicle.vehicle_fuel_type,
            vehicle_transmission: foundVehicle.vehicle_transmission,
            is_active: foundVehicle.is_active,
          })
        }
      }
    } catch (err) {
      setError("Failed to load vehicle details")
    } finally {
      setLoadingData(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "vehicle_year" ? Number.parseInt(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vehicle) return

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch(`https://fleetpulse-latest.onrender.com/admin/vehicle/${vehicle.id}`, {
        method: "PUT",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicle_brand: formData.vehicle_brand,
          vehicle_model: formData.vehicle_model,
          vehicle_year: formData.vehicle_year,
          vehicle_color: formData.vehicle_color,
          vehicle_plate_number: formData.vehicle_plate_number,
          vehicle_fuel_type: formData.vehicle_fuel_type,
          vehicle_transmission: formData.vehicle_transmission,
          is_active: Boolean(formData.is_active),
        }),
      })

      const data: ApiResponse<Vehicle> = await response.json()

      if (data.responseCode === "00") {
        setSuccess("Vehicle updated successfully!")
        setTimeout(() => {
          window.location.href = `/?email=${encodeURIComponent(userEmailFromParams)}`
        }, 2000)
      } else {
        setError(data.responseMessage || "Failed to update vehicle")
      }
    } catch (err) {
      setError("Failed to update vehicle. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading vehicle details...</p>
      </main>
    )
  }

  if (!vehicle) {
    return (
      <main className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href="/" className="flex items-center gap-2 text-primary hover:underline mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Edit Vehicle</h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-8 text-center border border-border">
            <p className="text-foreground">Vehicle not found</p>
            <Link href="/">
              <Button variant="outline" className="mt-4 bg-transparent">
                Back to Dashboard
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <main className="min-h-screen bg-background">
      {success && <Toast type="success" message={success} />}
      {error && <Toast type="error" message={error} />}

      <div className="border-b border-border bg-card">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Edit Vehicle</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Vehicle Info */}
        <Card className="p-6 mb-8 border border-border bg-muted/50">
          <h2 className="text-lg font-semibold text-foreground mb-4">Current Vehicle Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Sensor IMEI</p>
              <p className="text-foreground font-mono">{vehicle.sensor_imei}</p>
            </div>
            <div>
              <p className="text-muted-foreground">VIN</p>
              <p className="text-foreground font-mono">{vehicle.vehicle_vin}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="text-foreground">{formatDate(vehicle.created_at)}</p>
            </div>
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="vehicle_brand" className="block text-sm font-medium text-foreground mb-2">
                  Brand
                </label>
                <Input
                  id="vehicle_brand"
                  name="vehicle_brand"
                  value={formData.vehicle_brand}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="vehicle_model" className="block text-sm font-medium text-foreground mb-2">
                  Model
                </label>
                <Input
                  id="vehicle_model"
                  name="vehicle_model"
                  value={formData.vehicle_model}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="vehicle_year" className="block text-sm font-medium text-foreground mb-2">
                  Year
                </label>
                <Input
                  id="vehicle_year"
                  name="vehicle_year"
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={formData.vehicle_year}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="vehicle_color" className="block text-sm font-medium text-foreground mb-2">
                  Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="vehicle_color"
                    type="color"
                    value={formData.vehicle_color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vehicle_color: e.target.value }))}
                    className="h-10 w-20 rounded border border-input cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={formData.vehicle_color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, vehicle_color: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="vehicle_plate_number" className="block text-sm font-medium text-foreground mb-2">
                  Plate Number
                </label>
                <Input
                  id="vehicle_plate_number"
                  name="vehicle_plate_number"
                  value={formData.vehicle_plate_number}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="vehicle_fuel_type" className="block text-sm font-medium text-foreground mb-2">
                  Fuel Type
                </label>
                <Select
                  value={formData.vehicle_fuel_type}
                  onValueChange={(value) => handleSelectChange("vehicle_fuel_type", value)}
                >
                  <SelectTrigger id="vehicle_fuel_type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="vehicle_transmission" className="block text-sm font-medium text-foreground mb-2">
                  Transmission
                </label>
                <Select
                  value={formData.vehicle_transmission}
                  onValueChange={(value) => handleSelectChange("vehicle_transmission", value)}
                >
                  <SelectTrigger id="vehicle_transmission">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-2">Active Status</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, is_active: true }))}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        formData.vehicle_is_active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      On
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, is_active: false }))}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        !formData.vehicle_is_active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      Off
                    </button>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {formData.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Link href="/">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </main>
  )
}
