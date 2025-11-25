// hooks/subjects/assignments/useAssignmentDeadlinesStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AssignmentDeadlineEntry {
  assignmentId: string
  subjectId: string
  institutionId: string
  deadlineLocal: string // string que vem do DateTimePicker (ex.: "2025-11-21T13:30")
  updatedAt: string
}

interface AssignmentDeadlinesState {
  items: Record<string, AssignmentDeadlineEntry>
  setDeadline: (entry: AssignmentDeadlineEntry) => void
  removeDeadline: (assignmentId: string) => void
  clearBySubject: (institutionId: string, subjectId: string) => void
}

export const useAssignmentDeadlinesStore = create<AssignmentDeadlinesState>()(
  persist(
    (set, get) => ({
      items: {},

      setDeadline: (entry) =>
        set((state) => ({
          items: {
            ...state.items,
            [entry.assignmentId]: entry,
          },
        })),

      removeDeadline: (assignmentId) =>
        set((state) => {
          const items = { ...state.items }
          delete items[assignmentId]
          return { items }
        }),

      clearBySubject: (institutionId, subjectId) =>
        set((state) => {
          const items = { ...state.items }
          for (const [id, value] of Object.entries(items)) {
            if (
              value.institutionId === institutionId &&
              value.subjectId === subjectId
            ) {
              delete items[id]
            }
          }
          return { items }
        }),
    }),
    {
      name: "intellecta-assignment-deadlines", // key no localStorage
    }
  )
)
