"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useInstitutionClasses } from "@/hooks/classes/useInstitutionClasses"
import { useClassUsers } from "@/hooks/classes/useClassUsers"
import { useAddUsersToClass } from "@/hooks/classes/useAddUsersToClass"
import { useRemoveClassUser } from "@/hooks/classes/useRemoveClassUser"
import { useInstitutionUsers } from "@/hooks/institution/useInstitutionUsers"
import { useInstitution } from "../../layout"
import { InstitutionUser } from "@/hooks/institutions/useInstitutionUsers"
import { Class } from "../classes-subjects/components/types"
import Back from "../_components/Back"

export default function EnrollmentManageClient() {
  const { institution } = useInstitution()
  const { data: classes, isLoading: loadingClasses } = useInstitutionClasses(institution.institution_id)

  // Estado para turma selecionada
  const [classId, setClassId] = useState<string>("")

  // Usuários da turma selecionada
  const {
    data: classUsers,
    isLoading: loadingClassUsers,
    isFetching: fetchingClassUsers,
  } = useClassUsers(institution.institution_id, classId)

  // Usuários da instituição (para matrículas)
  const { data: instUsers, isLoading: loadingInstUsers } =
    useInstitutionUsers(institution.institution_id)

  // Ações (add/remove)
  const { mutateAsync: addUsers, isPending: adding } = useAddUsersToClass(
    institution.institution_id,
    classId
  )
  const { mutateAsync: removeUser, isPending: removing } = useRemoveClassUser(
    institution.institution_id,
    classId
  )

  // Seleções/estados da UI
  const [selectedForAdd, setSelectedForAdd] = useState<string[]>([])

  async function handleAdd() {
    if (!classId) return toast.error("Selecione uma turma.")
    if (selectedForAdd.length === 0)
      return toast.error("Selecione ao menos um usuário.")
    try {
      await addUsers(selectedForAdd)
      setSelectedForAdd([])
      toast.success("Usuários adicionados com sucesso.")
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Falha ao adicionar usuários."
      )
    }
  }

  async function handleRemove(class_users_id: string) {
    try {
      await removeUser(class_users_id)
      toast.success("Usuário removido da turma.")
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Falha ao remover usuário."
      )
    }
  }

  // Filtrar usuários disponíveis para adicionar (que ainda não estão na turma)
  const availableUsers = instUsers?.filter(
    (instUser: InstitutionUser) => 
      !classUsers?.some(classUser => classUser.user.user_id === instUser.user.user_id)
  ) || []

  // Obter a turma selecionada
  const selectedClass = classes?.find((cls: Class) => cls.class_id === classId)

  return (
    <div className="space-y-6">
      {/* Cabeçalho e Seletor de Turma */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Gerenciar Matrículas</h1>
            <p className="text-gray-600 mb-4">
              Adicione ou remova usuários das turmas da instituição
            </p>
          </div>  
          <Back hrefFallback={`/institutions/${institution.institution_id}/manage`}/>
        </div>

        <div className="flex flex-col  gap-4">
          <div className="flex-1">
            <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-1">
              Selecione uma turma
            </label>
            <select
              id="class-select"
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value)
                setSelectedForAdd([])
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingClasses}
            >
              <option value="">Selecione uma turma</option>
              {classes?.map((classItem: Class) => (
                <option key={classItem.class_id} value={classItem.class_id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>
          
          {selectedClass && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium text-blue-900">
                Turma selecionada: <span className="font-bold">{selectedClass.name}</span>
              </p>
              {selectedClass.description && (
                <p className="text-sm text-blue-700 mt-1">{selectedClass.description}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {classId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda - Adicionar Usuários */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Adicionar à Turma</h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {availableUsers.length} disponíveis
              </span>
            </div>
            
            {loadingInstUsers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Carregando usuários...</p>
              </div>
            ) : availableUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                {instUsers?.length === 0 
                  ? "Nenhum usuário disponível na instituição"
                  : "Todos os usuários já estão matriculados nesta turma"
                }
              </div>
            ) : (
              <>
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                  {availableUsers.map((instUser: InstitutionUser) => (
                    <div
                      key={instUser.institution_user_id}
                      className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedForAdd.includes(instUser.user.user_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedForAdd(prev => [...prev, instUser.user.user_id])
                          } else {
                            setSelectedForAdd(prev => prev.filter(id => id !== instUser.user.user_id))
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {instUser.user?.full_name || "Nome não disponível"}
                          </p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            instUser.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800'
                              : instUser.role === 'teacher'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {instUser.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {instUser.user?.email || "Email não disponível"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {selectedForAdd.length} usuário(s) selecionado(s)
                  </span>
                  <button
                    onClick={handleAdd}
                    disabled={selectedForAdd.length === 0 || adding}
                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {adding ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Adicionando...
                      </span>
                    ) : (
                      `Adicionar à Turma`
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Coluna Direita - Usuários Matriculados */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Usuários Matriculados</h2>
              <div className="flex items-center gap-2">
                {fetchingClassUsers && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Atualizando...
                  </span>
                )}
                <span className="text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded">
                  {classUsers?.length || 0} matriculados
                </span>
              </div>
            </div>

            {loadingClassUsers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Carregando matrículas...</p>
              </div>
            ) : !classUsers || classUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <p>Nenhum usuário matriculado nesta turma</p>
                <p className="text-sm mt-1">Use a coluna ao lado para adicionar usuários</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {classUsers.map((classUser) => (
                  <div
                    key={classUser.class_users_id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {classUser.user?.full_name || "Usuário não encontrado"}
                        </p>
                        {instUsers?.find((u: InstitutionUser) => u.user.user_id === classUser.user.user_id) && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            instUsers.find((u: InstitutionUser) => u.user.user_id === classUser.user.user_id)?.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800'
                              : instUsers.find((u: InstitutionUser) => u.user.user_id === classUser.user.user_id)?.role === 'teacher'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {instUsers.find((u: InstitutionUser) => u.user.user_id === classUser.user.user_id)?.role}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {classUser.user?.email || "Email não disponível"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(classUser.class_users_id)}
                      disabled={removing}
                      className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors whitespace-nowrap"
                    >
                      {removing ? "Removendo..." : "Remover"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!classId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-yellow-800 font-medium">
            Selecione uma turma para gerenciar as matrículas
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            Escolha uma turma da lista acima para começar a adicionar ou remover usuários
          </p>
        </div>
      )}
    </div>
  )
}