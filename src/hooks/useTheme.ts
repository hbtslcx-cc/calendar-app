import { useEffect, useState } from 'react';
import { useCalendarStore } from '@/store/calendarStore';

export function useTheme() {
  const { settings } = useCalendarStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      if (settings.theme === 'dark') {
        setIsDark(true);
      } else if (settings.theme === 'light') {
        setIsDark(false);
      } else {
        // System preference
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (settings.theme === 'system') {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [settings.theme]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return { isDark, theme: settings.theme };
}
