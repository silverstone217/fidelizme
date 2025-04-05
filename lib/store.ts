import { create } from "zustand";
import { UserType } from "../types";

type UserStateType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
};

export const useUserStore = create<UserStateType>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
