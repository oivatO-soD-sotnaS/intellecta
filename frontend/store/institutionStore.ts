// store/institutionStore.ts
import {create} from "zustand"

export type InstitutionTab = "overview" | "courses" | "members" | "settings"

interface InstitutionUIState {
  activeTab: InstitutionTab
  setActiveTab: (tab: InstitutionTab) => void
}

export const useInstitutionUI = create<InstitutionUIState>((set) => ({
  activeTab: "overview",
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
