import { create } from "zustand";

type NavigationProps = {
  pathname: string;
  setPathname: (path: string) => void;
};

export const useNavigation = create<NavigationProps>((set) => ({
  pathname: "/",
  setPathname: (path: string) => set({ pathname: path }),
}));
