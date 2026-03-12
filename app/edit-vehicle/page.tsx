import { Suspense } from "react"
import EditVehicleContent from "@/components/edit-vehicle-content"

export default function EditVehiclePage() {
  return (
    <Suspense fallback={null}>
      <EditVehicleContent />
    </Suspense>
  )
}
