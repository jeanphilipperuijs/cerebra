import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const SettingsPanel = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const [esUrl, setEsUrl] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const storedUrl = localStorage.getItem('ELASTIC_BASE_URL');
    if (storedUrl) {
      setEsUrl(storedUrl);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('ELASTIC_BASE_URL', esUrl.trim());
    alert('Elasticsearch URL saved. Please refresh the page.');
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl mt-6 max-w-4xl w-full">
      <details open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
        <summary className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Settings</h2>
        </summary>

        <div className="space-y-4 mt-4">
          {/* Dark mode toggle */}
          <div className="flex items-center space-x-4">
            <label htmlFor="darkModeToggle" className="text-gray-700 dark:text-gray-300 font-medium">
              Dark Mode
            </label>
            <input
              id="darkModeToggle"
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          {/* Elasticsearch URL input */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="esUrlInput" className="text-gray-700 dark:text-gray-300 font-medium">
              Elasticsearch Base URL
            </label>
            <input
              id="esUrlInput"
              type="text"
              value={esUrl}
              onChange={(e) => setEsUrl(e.target.value)}
              className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100"
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
      </details>
    </div>
  );
};

export default SettingsPanel;
