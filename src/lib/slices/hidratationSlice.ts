export interface Hidration {
  isHy: boolean;
  setHydrated: () => void;
}

export const createHidrationSlice = (set: any): Hidration => ({
  isHy: false,
  setHydrated: () => set({ isHy: true })
});