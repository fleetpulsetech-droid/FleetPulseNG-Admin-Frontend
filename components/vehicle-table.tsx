"use client"

import { Edit2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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

export default function VehicleTable({ vehicles, userEmail }: { vehicles: Vehicle[]; userEmail: string }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold text-foreground">Sensor IMEI</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">VIN</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Brand</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Model</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Year</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Color</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Plate</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Fuel</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Transmission</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Created</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="py-3 px-4 text-foreground font-mono text-xs">{vehicle.sensor_imei}</td>
              <td className="py-3 px-4 text-foreground font-mono text-xs">{vehicle.vehicle_vin}</td>
              <td className="py-3 px-4 text-foreground">{vehicle.vehicle_brand}</td>
              <td className="py-3 px-4 text-foreground">{vehicle.vehicle_model}</td>
              <td className="py-3 px-4 text-foreground">{vehicle.vehicle_year}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: vehicle.vehicle_color }}
                  />
                  <span className="text-foreground">{vehicle.vehicle_color}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-foreground font-medium">{vehicle.vehicle_plate_number}</td>
              <td className="py-3 px-4 text-foreground text-sm">{vehicle.vehicle_fuel_type}</td>
              <td className="py-3 px-4 text-foreground text-sm">{vehicle.vehicle_transmission}</td>
              <td className="py-3 px-4">
                <Badge variant={vehicle.is_active ? "default" : "secondary"}>
                  {vehicle.is_active ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(vehicle.created_at)}</td>
              <td className="py-3 px-4">
                <Link href={`/edit-vehicle?vehicleId=${vehicle.id}&userEmail=${encodeURIComponent(userEmail)}`}>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
