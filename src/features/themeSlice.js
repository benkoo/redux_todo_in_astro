import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

/**
 * @typedef {'light'|'dark'} ThemeMode
 * @typedef {Object} ThemeColors
 * @property {string} primary
 * @property {string} background
 * @property {string} text
 * @property {string} border
 * @property {string} hover
 */

// Initialize with system preference or fallback
const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/** @type {{ mode: ThemeMode }} */
const initialState = {
  mode: getInitialTheme()
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    /**
     * Toggles between light/dark themes and updates CSS variables
     */
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(state.mode);
        localStorage.setItem('theme', state.mode);
      }
    }
  }
});

// Memoized selectors
export const selectThemeMode = createSelector(
  [(state) => state.theme],
  (theme) => theme.mode
);

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;