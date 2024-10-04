import { IUserSlice, createUserSlice } from "@/lib/slices/createUserSlice";
import { ProjectSlice, createProjectSlice } from "@/lib/slices/createProjectSlice";
import { ICommerceSlice, createCommerceSlice } from "@/lib/slices/commerceSlice";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AppStore extends ProjectSlice, IUserSlice, ICommerceSlice {
  resetStore: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...createUserSlice(set),
      ...createProjectSlice(set),
      ...createCommerceSlice(set),
      resetStore: () => {
        // Clear the session storage
        sessionStorage.removeItem("project");
        // Reset the Zustand store to initial state
        set({
          ...createUserSlice(set),
          ...createProjectSlice(set),
          ...createCommerceSlice(set)
        });
      }
    }),
    {
      name: "project",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
