import { IUserSlice, createUserSlice } from "@/lib/slices/createUserSlice";
import { ProjectSlice, createProjectSlice } from "@/lib/slices/createProjectSlice";
import { ICommerceSlice, createCommerceSlice } from "@/lib/slices/commerceSlice";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { formatMoneySlice, IFormatMoneyStore } from "@/lib/slices/formatMoneySlice";

interface AppStore extends ProjectSlice, IUserSlice, ICommerceSlice, IFormatMoneyStore {
  resetStore: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...createUserSlice(set),
      ...createProjectSlice(set),
      ...createCommerceSlice(set),
      ...formatMoneySlice(set, get),
      resetStore: () => {
        // Clear the session storage
        sessionStorage.removeItem("project");
        // Reset the Zustand store to initial state
        set({
          ...createUserSlice(set),
          ...createProjectSlice(set),
          ...createCommerceSlice(set),
          ...formatMoneySlice(set, get)
        });
      }
    }),
    {
      name: "project",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
