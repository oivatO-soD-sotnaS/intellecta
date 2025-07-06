// app/(locale)/(private)/profile/store/profileStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ProfileState {
  fullName: string
  profilePictureId?: string
  profilePictureUrl?: string

  setProfile: (
    fullName: string,
    pictureId?: string,
    pictureUrl?: string
  ) => void
  clearProfile: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      fullName: "",
      profilePictureId: undefined,
      profilePictureUrl: undefined,
      setProfile: (fullName, pictureId, pictureUrl) =>
        set({
          fullName,
          profilePictureId: pictureId,
          profilePictureUrl: pictureUrl,
        }),
      clearProfile: () =>
        set({
          fullName: "",
          profilePictureId: undefined,
          profilePictureUrl: undefined,
        }),
    }),
    {
      name: "profile-storage", 
    }
  )
)
