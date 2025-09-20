import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  actualTheme: 'light' | 'dark';
}

interface ThemeActions {
  setTheme: (theme: Theme) => void;
  getSystemTheme: () => 'light' | 'dark';
  updateActualTheme: () => void;
}

type ThemeStore = ThemeState & ThemeActions;

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const updateDocumentTheme = (theme: 'light' | 'dark') => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'system',
      actualTheme: getSystemTheme(),

      setTheme: (theme: Theme) => {
        const actualTheme = theme === 'system' ? getSystemTheme() : theme;
        updateDocumentTheme(actualTheme);
        set({ theme, actualTheme });
      },

      getSystemTheme,

      updateActualTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          const actualTheme = getSystemTheme();
          updateDocumentTheme(actualTheme);
          set({ actualTheme });
        }
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const actualTheme = state.theme === 'system' ? getSystemTheme() : state.theme;
          updateDocumentTheme(actualTheme);
          state.actualTheme = actualTheme;
        }
      }
    }
  )
);

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    useThemeStore.getState().updateActualTheme();
  });
}