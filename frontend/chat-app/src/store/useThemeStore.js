import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("baatCheet-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("baatCheet-theme", theme);
    set({ theme });
  },
}));