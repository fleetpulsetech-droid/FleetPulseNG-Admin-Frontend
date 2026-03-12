import { Suspense } from "react"
import DashboardContent from "@/components/dashboard-content"

export default function Dashboard() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  )
}
