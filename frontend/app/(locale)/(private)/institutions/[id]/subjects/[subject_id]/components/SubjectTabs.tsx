import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SubjectAssignmentsTab from "./SubjectAssignmentsTab"
import SubjectOverviewTab from "./SubjectOverviewTab"
import { SubjectMaterialsTab } from "./SubjectMaterialsTab"

interface SubjectTabsProps {
  institutionId: string
  subjectId: string
  subject?: any
  isLoading?: boolean
  isTeacher: boolean
  userRole?: string
  currentUserId?: string
}

export default function SubjectTabs({
  institutionId,
  subjectId,
  subject,
  isTeacher,
  isLoading,
  userRole,
  currentUserId,
}: SubjectTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="overview">Visão geral</TabsTrigger>
        <TabsTrigger value="materials">Materiais</TabsTrigger>
        <TabsTrigger value="assignments">Atividades</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <SubjectOverviewTab
          institutionId={institutionId}
          subjectId={subjectId}
          isTeacher={isTeacher}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="materials" className="space-y-4">
        <SubjectMaterialsTab
          institutionId={institutionId}
          subjectId={subjectId}
          isTeacher={isTeacher}
          userRole={userRole}
          currentUserId={currentUserId}
        />
      </TabsContent>

      <TabsContent value="assignments" className="space-y-4">
        <SubjectAssignmentsTab
          institutionId={institutionId}
          subjectId={subjectId}
          isTeacher={isTeacher}
          userRole={userRole}
          currentUserId={currentUserId}
        />
      </TabsContent>
    </Tabs>
  )
}
