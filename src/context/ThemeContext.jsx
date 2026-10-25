// ThemeContext: Demonstrates Context API for cross-cutting UI state (Dark/Light mode)
// Syllabus Topic: Context API & Global vs Local State
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = 'welfora-dark';

export function ThemeProvider({ children }) {
  // Global theme state persisted to localStorage
  const [dark, setDark] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return stored !== null ? stored !== 'false' : true; // Default dark
    } catch {
      return true;
    }
  });

  // Sync theme changes to localStorage and DOM element classes
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, String(dark));
    } catch {
      // Ignore localStorage write failures in sandbox
    }
    // Update root document data-theme attribute for CSS accessibility
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleTheme = useCallback(() => {
    setDark(prev => !prev);
  }, []);

  return (
    <ThemeContext.Provider value={{ dark, setDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to consume ThemeContext safely
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
