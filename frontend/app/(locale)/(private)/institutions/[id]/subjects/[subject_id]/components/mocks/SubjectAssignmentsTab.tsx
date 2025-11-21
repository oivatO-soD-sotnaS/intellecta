// "use client"

// import { useMemo, useState } from "react"
// import {
//   useCreateAssignment,
//   useSubjectAssignment,
// } from "@/hooks/subjects/assignments/useSubjectAssignments"
// import { Card } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Button } from "@/components/ui/button"
// import { ClipboardList } from "lucide-react"

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import AssignmentCard from "../AssignmentCard"
// import AssignmentSubmissionsPanel from "../AssignmentSubmissionsPanel"
// import MySubmissionPanel from "../assignments/MySubmissionPanel"

// interface SubjectAssignmentsTabProps {
//   institutionId: string
//   subjectId: string
//   isTeacher: boolean
// }

// // 🔹 Dados MOCK para visualizar cartões de atividades
// const MOCK_ASSIGNMENTS = [
//   {
//     assignment_id: "mock-assignment-1",
//     title: "Tarefa 1 - Função Afim",
//     description:
//       "Resolva os exercícios 1 a 10 do material 'Lista 1 - Funções Afim'. Entregue em PDF.",
//     due_date: "2025-11-25T23:59:00.000Z",
//   },
//   {
//     assignment_id: "mock-assignment-2",
//     title: "Tarefa 2 - Função Quadrática",
//     description:
//       "Desenvolva o gráfico de 5 funções quadráticas e identifique raízes, vértice e concavidade.",
//     due_date: "2025-11-30T23:59:00.000Z",
//   },
//   {
//     assignment_id: "mock-assignment-3",
//     title: "Questionário Online - Revisão",
//     description:
//       "Questionário de múltipla escolha sobre os conteúdos das últimas aulas.",
//     due_date: "2025-12-05T20:00:00.000Z",
//   },
// ]

// export default function SubjectAssignmentsTabMock({
//   institutionId,
//   subjectId,
//   isTeacher,
// }: SubjectAssignmentsTabProps) {
//   const [selectedAssignmentId, setSelectedAssignmentId] = useState<
//     string | null
//   >(null)

//   const [openDialog, setOpenDialog] = useState(false)
//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [dueDate, setDueDate] = useState("")

//   const { data: assignments, isLoading } = useSubjectAssignment(
//     institutionId,
//     subjectId
//   )

//   const createAssignmentMutation = useCreateAssignment(institutionId, subjectId)

//   const hasRealAssignments = !!assignments && assignments.length > 0

//   // 🔹 Se não veio nada da API, usamos os mocks
//   const assignmentsToRender = useMemo(() => {
//     if (hasRealAssignments) return assignments!
//     return MOCK_ASSIGNMENTS
//   }, [hasRealAssignments, assignments])

//   const isUsingMock = !hasRealAssignments

//   function handleOpenDialog() {
//     setOpenDialog(true)
//   }

//   function handleCloseDialog() {
//     if (createAssignmentMutation.isPending) return
//     setOpenDialog(false)
//     setTitle("")
//     setDescription("")
//     setDueDate("")
//   }

//   function handleSubmitAssignment(e: React.FormEvent) {
//     e.preventDefault()
//     if (!title.trim()) return

//     createAssignmentMutation.mutate(
//       {
//         title,
//         description,
//         due_date: dueDate || null,
//       },
//       {
//         onSuccess(data: any) {
//           setSelectedAssignmentId(data.assignment_id ?? null)
//           handleCloseDialog()
//         },
//       }
//     )
//   }

//   return (
//     <section className="space-y-4">
//       <div className="flex items-center justify-between gap-2">
//         <div className="flex flex-col">
//           <h2 className="text-sm font-semibold">Atividades da disciplina</h2>
//           {/* {isUsingMock && (
//             <span className="text-[11px] text-muted-foreground">
//               Exibindo atividades de exemplo (mock) enquanto a API estiver
//               vazia.
//             </span>
//           )} */}
//         </div>

//         {isTeacher && (
//           <Button size="sm" variant="outline" onClick={handleOpenDialog}>
//             Nova atividade
//           </Button>
//         )}
//       </div>

//       {isLoading && (
//         <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <Card key={i} className="border-border/60 p-4">
//               <Skeleton className="mb-2 h-4 w-40" />
//               <Skeleton className="mb-1 h-3 w-full" />
//               <Skeleton className="h-3 w-3/4" />
//             </Card>
//           ))}
//         </div>
//       )}

//       {!isLoading && assignmentsToRender.length > 0 && (
//         <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
//           {assignmentsToRender.map((assignment: any) => (
//             <AssignmentCard
//               key={assignment.assignment_id}
//               assignment={assignment}
//               isSelected={selectedAssignmentId === assignment.assignment_id}
//               onSelect={
//                 isUsingMock
//                   ? undefined // 🔹 não abre painel de submissões com mock
//                   : () =>
//                       setSelectedAssignmentId((prev) =>
//                         prev === assignment.assignment_id
//                           ? null
//                           : assignment.assignment_id
//                       )
//               }
//             />
//           ))}
//         </div>
//       )}

//       {/* Painel de entregas só faz sentido quando não estamos em mock */}
//       {!isUsingMock && selectedAssignmentId && (
//         <div className="space-y-3">
//           {isTeacher ? (
//             <AssignmentSubmissionsPanel
//               institutionId={institutionId}
//               subjectId={subjectId}
//               assignmentId={selectedAssignmentId}
//             />
//           ) : (
//             <MySubmissionPanel
//               institutionId={institutionId}
//               subjectId={subjectId}
//               assignmentId={selectedAssignmentId}
//             />
//           )}
//         </div>
//       )}

//       {/* Dialog de criação de atividade (vai funcionar quando o backend estiver certo) */}
//       {isTeacher && (
//         <Dialog open={openDialog} onOpenChange={handleCloseDialog}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Nova atividade</DialogTitle>
//               <DialogDescription>
//                 Crie uma nova tarefa ou avaliação para os alunos desta
//                 disciplina.
//               </DialogDescription>
//             </DialogHeader>

//             <form onSubmit={handleSubmitAssignment} className="space-y-3 py-2">
//               <div className="space-y-1">
//                 <label className="text-xs font-medium text-foreground">
//                   Título
//                 </label>
//                 <Input
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="Ex.: Tarefa 1 - Exercícios de revisão"
//                   required
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-xs font-medium text-foreground">
//                   Descrição
//                 </label>
//                 <Textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   rows={3}
//                   placeholder="Explique o que os alunos devem fazer."
//                 />
//               </div>

//               <div className="space-y-1">
//                 <label className="text-xs font-medium text-foreground">
//                   Data limite (opcional)
//                 </label>
//                 <Input
//                   type="datetime-local"
//                   value={dueDate}
//                   onChange={(e) => setDueDate(e.target.value)}
//                 />
//                 <p className="text-[11px] text-muted-foreground">
//                   Ajuste o campo enviado conforme o atributo esperado pelo
//                   backend (ex.: due_date, deadline).
//                 </p>
//               </div>

//               <DialogFooter>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={handleCloseDialog}
//                   disabled={createAssignmentMutation.isPending}
//                 >
//                   Cancelar
//                 </Button>
//                 <Button
//                   type="submit"
//                   size="sm"
//                   disabled={createAssignmentMutation.isPending}
//                 >
//                   {createAssignmentMutation.isPending
//                     ? "Criando..."
//                     : "Criar atividade"}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       )}
//     </section>
//   )
// }
