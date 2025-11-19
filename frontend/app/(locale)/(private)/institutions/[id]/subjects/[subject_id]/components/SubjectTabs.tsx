import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SubjectMaterialsTab from "./SubjectMaterialsTab"
import SubjectAssignmentsTab from "./SubjectAssignmentsTab"
import SubjectOverviewTab from "./SubjectOverviewTab"
import SubjectAssignmentsTabMock from "./mocks/SubjectAssignmentsTab"
import SubjectMaterialsTabMock from "./mocks/SubjectMaterialsTab"


interface SubjectTabsProps {
  institutionId: string
  subjectId: string
  subject?: any
  isTeacher: boolean
  isLoading?: boolean
}

export default function SubjectTabs({
  institutionId,
  subjectId,
  subject,
  isTeacher,
  isLoading,
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
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="assignments" className="space-y-4">
        <SubjectAssignmentsTab
          institutionId={institutionId}
          subjectId={subjectId}
          isTeacher={isTeacher}
        />
      </TabsContent>
    </Tabs>
  )
}
