export interface IUserSlice {
  userId: number;
  // eslint-disable-next-line no-unused-vars
  setUserId: (id: number) => void;
}

export const createUserSlice = (set: any): IUserSlice => ({
  userId: 0,
  setUserId: (id: number) => set({ userId: id })
});
