import { useEffect } from 'react';
import { Home } from '@/pages/Home';
import { useTheme } from '@/hooks/useTheme';

export default function App() {
  useTheme();

  return <Home />;
}
