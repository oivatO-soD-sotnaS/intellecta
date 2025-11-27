import { create } from "zustand"
import { persist } from "zustand/middleware"

type SubmissionKey = {
  institutionId: string
  subjectId: string
  assignmentId: string
  userId: string
}

type SubmissionCache = Record<string, string> 

interface SubmissionCacheState {
  map: SubmissionCache
  getSubmissionId: (key: SubmissionKey) => string | undefined
  setSubmissionId: (key: SubmissionKey, submissionId: string) => void
  clearAll: () => void
}

function serializeKey({
  institutionId,
  subjectId,
  assignmentId,
  userId,
}: SubmissionKey) {
  return `${userId}:${institutionId}:${subjectId}:${assignmentId}`
}

export const useSubmissionCacheStore = create<SubmissionCacheState>()(
  persist(
    (set, get) => ({
      map: {},
      getSubmissionId: (key) => {
        const k = serializeKey(key)
        return get().map[k]
      },
      setSubmissionId: (key, submissionId) => {
        const k = serializeKey(key)
        set((state) => ({
          map: {
            ...state.map,
            [k]: submissionId,
          },
        }))
      },
      clearAll: () => set({ map: {} }),
    }),
    {
      name: "intellecta-submission-cache", 
    }
  )
)
