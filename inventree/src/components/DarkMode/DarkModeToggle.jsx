import React from 'react';
import { useDarkMode } from './DarkModeContext';
import './DarkModeToggle.css';
import darkModeIcon from '../../assets/images/dark_mode.png';
import lightModeIcon from '../../assets/images/light_mode.png';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="dark-mode-toggle" onClick={toggleDarkMode}>
      <img
        src={darkMode ? lightModeIcon : darkModeIcon}
        alt={darkMode ? '라이트 모드' : '다크 모드'}
        className="dark-mode-icon"
      />
    </div>
  );
};

export default DarkModeToggle;
