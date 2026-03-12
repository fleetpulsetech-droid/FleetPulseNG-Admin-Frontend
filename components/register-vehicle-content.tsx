"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Toast from "@/components/toast"
import { useSearchParams } from "next/navigation"

interface ApiResponse<T> {
  responseCode: string
  responseMessage: string
  data: T
}

export default function RegisterVehicleContent() {
  const searchParams = useSearchParams()
  const userIdFromParams = searchParams.get("userId") || ""
  const emailFromParams = searchParams.get("email") || ""

  const [formData, setFormData] = useState({
    user_id: Number.parseInt(userIdFromParams) || 0,
    sensor_imei: "",
    vehicle_vin: "",
    vehicle_brand: "",
    vehicle_model: "",
    vehicle_year: new Date().getFullYear(),
    vehicle_color: "#000000",
    vehicle_plate_number: "",
    vehicle_fuel_type: "Gasoline",
    vehicle_transmission: "Automatic",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
    setError("")
    setSuccess("")

    if (
      !formData.sensor_imei ||
      !formData.vehicle_vin ||
      !formData.vehicle_brand ||
      !formData.vehicle_model ||
      !formData.vehicle_plate_number
    ) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("https://fleetpulse-latest.onrender.com/admin/register-vehicle", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data: ApiResponse<any> = await response.json()

      if (data.responseCode === "00") {
        setSuccess("Vehicle registered successfully!")
        // Reset form
        setFormData({
          user_id: formData.user_id,
          sensor_imei: "",
          vehicle_vin: "",
          vehicle_brand: "",
          vehicle_model: "",
          vehicle_year: new Date().getFullYear(),
          vehicle_color: "#000000",
          vehicle_plate_number: "",
          vehicle_fuel_type: "Gasoline",
          vehicle_transmission: "Automatic",
        })
        setTimeout(() => {
          window.location.href = `/?email=${encodeURIComponent(emailFromParams)}`
        }, 2000)
      } else {
        setError(data.responseMessage || "Failed to register vehicle")
      }
    } catch (err) {
      setError("Failed to register vehicle. Please try again.")
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold text-foreground">Register New Vehicle</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sensor_imei" className="block text-sm font-medium text-foreground mb-2">
                  Sensor IMEI
                </label>
                <Input
                  id="sensor_imei"
                  name="sensor_imei"
                  placeholder="e.g., 862272082611395"
                  value={formData.sensor_imei}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="vehicle_vin" className="block text-sm font-medium text-foreground mb-2">
                  Vehicle VIN
                </label>
                <Input
                  id="vehicle_vin"
                  name="vehicle_vin"
                  placeholder="e.g., JHMCP26318C031384"
                  value={formData.vehicle_vin}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="vehicle_brand" className="block text-sm font-medium text-foreground mb-2">
                  Brand
                </label>
                <Input
                  id="vehicle_brand"
                  name="vehicle_brand"
                  placeholder="e.g., Honda"
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
                  placeholder="e.g., Accord"
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
                  placeholder="e.g., qwh-334-h4j4"
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
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Registering..." : "Register Vehicle"}
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
