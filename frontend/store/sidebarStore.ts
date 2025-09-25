// store/sidebarStore.ts
import { create } from "zustand";

type SidebarState = {
  isCollapsed: boolean;
  toggle: () => void;
  set: (v: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  toggle: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
  set: (v) => set({ isCollapsed: v }),
}));
