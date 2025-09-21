import InstitutionClient from "./InstitutionClient"
import CoursesList from "./components/CoursesList" 
import { DashboardHeader, StatCards } from "./dashboard/components"
import CalendarWidget from "./dashboard/components/CalendarWidget"
import DisciplinesGrid from "./dashboard/components/DisciplinesGrid"
import RecentActivities from "./dashboard/components/RecentActivities"
import UpcomingEvents from "./dashboard/components/UpcomingEvents"

export default function InstitutionPage() {
  return (
    <InstitutionClient>
      <section className="space-y-5">
        <DashboardHeader name="Ana" />
        <StatCards />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DisciplinesGrid />
          <CalendarWidget />
        </div>
        <div className="lg:col-span-1">
          <UpcomingEvents />
        </div>
        <RecentActivities/>
      </section>
    </InstitutionClient>
  )

}
