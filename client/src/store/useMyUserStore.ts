import { create } from 'zustand'

type UserState = {
  myUser: User | null;
}

type UserAction = {
  setMyUser: (user: User) => void,
  resetMyUser: () => void
};

export const useMyUserStore = create<UserState & UserAction>((set) => ({
  myUser: null,
  setMyUser: (user) => set({ myUser: user }),
  resetMyUser: () => set({ myUser: null }),
}));