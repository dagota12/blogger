import { create } from "zustand";

export type AuthUser = {
  name: String;
  email: String;
  id: String;
  profile_img: string;
};
type AuthType = {
  user: AuthUser | null;
  authenticated: boolean;
  login: (data: FormData) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
};

export const useAuth = create<AuthType>((set) => ({
  authenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  setUser: (user) => {
    set({ user });
  },
}));
