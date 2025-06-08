import React, { useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const SettingsPanel = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl mt-6 max-w-4xl w-full">
      <details open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
        <summary className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Settings</h2>
        </summary>
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
      </details>
    </div>
  );
};

export default SettingsPanel;
