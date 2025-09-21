import InstitutionClient from "./InstitutionClient"
import CoursesList from "./components/CoursesList" 
import { DashboardHeader, StatCards } from "./dashboard/components"

export default function InstitutionPage() {
  return (
    <InstitutionClient>
      <section className="space-y-5">
        <DashboardHeader name="Ana" />
        <StatCards />
      </section>
    </InstitutionClient>
  )
}
