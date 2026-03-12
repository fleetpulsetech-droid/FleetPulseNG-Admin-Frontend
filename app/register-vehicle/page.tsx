import { Suspense } from "react"
import RegisterVehicleContent from "@/components/register-vehicle-content"

export default function RegisterVehiclePage() {
  return (
    <Suspense fallback={null}>
      <RegisterVehicleContent />
    </Suspense>
  )
}
