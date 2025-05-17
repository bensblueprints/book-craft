import { create } from "zustand";

interface IState {
  name?: string | null;
  email?: string | undefined | null;
  id?: string | undefined | null;
  credits?: number;
  isLoading?: boolean;
}

interface AppState extends IState {
  updateInfo: (data: IState) => void;
}

export const useProfileStore = create<AppState>((set) => ({
  name: "",
  email: "",
  id: "",
  credits: 0,
  isLoading: false,
  updateInfo: (data) => set((state) => ({ ...state, ...data })),
}));
