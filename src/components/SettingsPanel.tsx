import { useContext, useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';


export const SettingsPanel = ({ forceOpen = false }: { forceOpen?: boolean }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [open, setOpen] = useState(forceOpen);
  const [esUrl, setEsUrl] = useState('');

  useEffect(() => {
    const storedUrl = localStorage.getItem('ELASTIC_BASE_URL');
    if (storedUrl?.includes('://')) {
      setEsUrl(storedUrl.replace(/\/+$/, ''));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('ELASTIC_BASE_URL', esUrl.trim().replace(/\/+$/, ''));
    alert('Elasticsearch URL saved. Please refresh the page.');
  };

  return (
    <div>
      {/* Dark mode toggle */}
      <div className="flex items-center space-x-4 mb-4">
        <label htmlFor="darkModeToggle" className="text-gray-700 dark:text-gray-300 font-medium">
          Dark mode
        </label>
        <input
          id="darkModeToggle"
          type="checkbox"
          checked={darkMode}
          onChange={toggleDarkMode}
          className="w-5 h-5 cursor-pointer"
        />
      </div>

      {/* ES URL input */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="esUrlInput" className="text-gray-700 dark:text-gray-300 font-medium">
          Elasticsearch Base URL
        </label>
        <input
          id="esUrlInput"
          type="text"
          value={esUrl}
          onChange={(e) => setEsUrl(e.target.value)}
          className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 w-full"
          placeholder="http://localhost:9200"
        />
        <button
          onClick={handleSave}
          className="self-start px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Save URL
        </button>
      </div>
    </div>
  );
};
