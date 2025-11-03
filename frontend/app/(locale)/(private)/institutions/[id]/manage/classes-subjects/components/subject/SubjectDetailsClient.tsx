// "use client"

// import { useMemo, useState } from "react"
// import Link from "next/link"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { ArrowLeft, BookOpen, CalendarDays, Files } from "lucide-react"
// import { Assignment, Material, Subject } from "../types"
// import { MOCK_SUBJECTS } from "../mocks"
// import { MOCK_ASSIGNMENTS_BY_SUBJECT, MOCK_MATERIALS_BY_SUBJECT } from "../mocks.details"
// import SubjectOverview from "./SubjectOverview"
// import SubjectAssignments from "./SubjectAssignments"
// import SubjectMaterials from "./SubjectMaterials"
// import { Badge } from "@heroui/badge"
// import Back from "../../../_components/Back"



// export default function SubjectDetailsClient({
//   institutionId,
//   subjectId,
// }: {
//   institutionId: string
//   subjectId: string
// }) {
//   const initial = useMemo<Subject | undefined>(
//     () => MOCK_SUBJECTS.find((s) => s.subject_id === subjectId),
//     [subjectId]
//   )

//   const [subject, setSubject] = useState<Subject | undefined>(initial)
//   const [assignments, setAssignments] = useState<Assignment[]>(
//     MOCK_ASSIGNMENTS_BY_SUBJECT[subjectId] ?? []
//   )
//   const [materials, setMaterials] = useState<Material[]>(
//     MOCK_MATERIALS_BY_SUBJECT[subjectId] ?? []
//   )

//   if (!subject) {
//     return (
//       <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-10">
//         <Card className="rounded-2xl">
//           <CardContent className="p-8">
//             <div className="text-sm text-muted-foreground">
//               Disciplina não encontrada (mock).{" "}
//               <Link
//                 href={`/institutions/${institutionId}/manage/classes-subjects`}
//                 className="underline"
//               >
//                 Voltar
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 space-y-6">
//       <div className="space-x-4">
//         <Back
//           hrefFallback={`/institutions/${institutionId}/manage/classes-subjects`}
//         />
//       </div>

//       <Card className="rounded-2xl overflow-hidden">
//         {subject.banner ? (
//           <div className="h-36 w-full bg-muted/40">
//             <img
//               src={subject.banner}
//               alt=""
//               className="h-full w-full object-cover"
//             />
//           </div>
//         ) : null}
//         <CardHeader className="pb-3">
//           <CardTitle className="text-lg flex items-center gap-2">
//             <BookOpen className="h-5 w-5" />
//             {subject.name}
//           </CardTitle>
//           <CardDescription>{subject.description}</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Separator />
//           <Tabs defaultValue="overview" className="mt-4">
//             <TabsList className="rounded-xl">
//               <TabsTrigger value="overview" className="gap-2">
//                 <BookOpen className="h-4 w-4" /> Visão Geral
//               </TabsTrigger>
//               <TabsTrigger value="assignments" className="gap-2">
//                 <CalendarDays className="h-4 w-4" /> Atividades
//               </TabsTrigger>
//               <TabsTrigger value="materials" className="gap-2">
//                 <Files className="h-4 w-4" /> Materiais
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="overview" className="pt-4">
//               <SubjectOverview subject={subject} onUpdate={setSubject} />
//             </TabsContent>

//             <TabsContent value="assignments" className="pt-4">
//               <SubjectAssignments
//                 subjectId={subject.subject_id}
//                 items={assignments}
//                 onCreate={(a) => setAssignments((p) => [a, ...p])}
//                 onUpdate={(a) =>
//                   setAssignments((p) =>
//                     p.map((x) => (x.assignment_id === a.assignment_id ? a : x))
//                   )
//                 }
//                 onDelete={(id) =>
//                   setAssignments((p) => p.filter((x) => x.assignment_id !== id))
//                 }
//               />
//             </TabsContent>

//             <TabsContent value="materials" className="pt-4">
//               <SubjectMaterials
//                 subjectId={subject.subject_id}
//                 items={materials}
//                 onCreate={(m) => setMaterials((p) => [m, ...p])}
//                 onUpdate={(m) =>
//                   setMaterials((p) =>
//                     p.map((x) => (x.material_id === m.material_id ? m : x))
//                   )
//                 }
//                 onDelete={(id) =>
//                   setMaterials((p) => p.filter((x) => x.material_id !== id))
//                 }
//               />
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
