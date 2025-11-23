// app/(locale)/(private)/institutions/[id]/manage/classes/page.tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Users, BookOpen, MoreVertical, Pencil, Trash2, Image } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useClasses } from "@/hooks/classes/useClasses"
import { useDeleteClass } from "@/hooks/classes/mutations"
import type { ClassDTO } from "@/types/class"
import { useInstitution } from "../../layout"
import ClassModal from "../../components/classes/ClassModal"
import ClassEditClassModal from "../../components/classes/ClassEditClassModal"
import { motion } from "framer-motion"
import CourseCard from "../../components/CourseCard"
import Back from "../_components/Back"

export default function ClassesManagePage() {
  const { institution, me } = useInstitution()
  const router = useRouter()
  
  const { data: classes, isLoading, isError, refetch } = useClasses(institution.institution_id)

  // Estados para modais
  const [createModalOpen, setCreateModalOpen] = React.useState(false)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [selectedClass, setSelectedClass] = React.useState<ClassDTO | null>(null)
  
  // Estado para busca
  const [searchTerm, setSearchTerm] = React.useState("")

  // Hook para deletar turma
  const deleteClass = useDeleteClass(institution.institution_id)

  // Filtrar turmas baseado no termo de busca
  const filteredClasses = React.useMemo(() => {
    if (!classes) return []
    
    return classes.filter(cls => 
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [classes, searchTerm])

  const handleCreateSuccess = () => {
    setCreateModalOpen(false)
    refetch()
  }

  const handleEdit = (cls: ClassDTO) => {
    setSelectedClass(cls)
    setEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    setEditModalOpen(false)
    setSelectedClass(null)
    refetch()
  }

  const handleDelete = async (classId: string) => {
    try {
      await deleteClass.mutateAsync(classId)
      refetch()
    } catch (error) {
      console.error("Erro ao deletar turma:", error)
    }
  }

  const handleViewClass = (classId: string) => {
    router.push(`/institutions/${institution.institution_id}/classes/${classId}`)
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Erro ao carregar turmas</h3>
          <p className="text-muted-foreground mb-4">Ocorreu um erro ao buscar as turmas da instituição.</p>
          <Button onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Turmas</h1>
          <p className="text-muted-foreground mt-1">
            Crie e gerencie as turmas da sua instituição
          </p>
        </div>
        <Back hrefFallback={`/institutions/${institution.institution_id}/manage`}/>
      </div>

      {/* Barra de busca e estatísticas */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="sm:w-auto w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Turma
          </Button>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar turmas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{filteredClasses.length} turma(s)</span>
          <span>•</span>
          <span>{classes?.length || 0} total</span>
        </div>
      </div>

      {/* Grid de Turmas */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center pt-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchTerm ? "Nenhuma turma encontrada" : "Nenhuma turma criada"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm 
              ? "Tente ajustar os termos da busca."
              : "Comece criando a primeira turma da sua instituição."
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Turma
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls, i) => (
             <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.04 * i }}
              >
                <CourseCard
                  klass={cls}
                  institutionId={institution.institution_id}
                  canManage={me.role === "admin"}
                  onDeleted={() => refetch()}
                  onEditClass={handleEdit}
                  onOpen={() => handleEdit(cls)}
                />
              </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ClassModal
        isOpen={createModalOpen}
        onOpenChange={setCreateModalOpen}
        institutionId={institution.institution_id}
        onCreated={handleCreateSuccess}
      />

      <ClassEditClassModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        institutionId={institution.institution_id}
        klass={selectedClass}
        onSaved={handleEditSuccess}
      />
    </div>
  )
}