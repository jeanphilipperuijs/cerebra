import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import { loadConfig } from './services/config';

export const App = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadConfig().then(() => {
      console.log('Config loaded');
    });
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Dashboard />
    </ThemeProvider>
  );
};
