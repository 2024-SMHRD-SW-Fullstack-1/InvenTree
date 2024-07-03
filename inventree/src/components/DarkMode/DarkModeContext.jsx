/**
 * @fileoverview 다크 모드 관리를 위한 Context와 Provider 컴포넌트
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 다크 모드 Context 생성
const DarkModeContext = createContext();

/**
 * 다크 모드 사용을 위한 커스텀 훅
 * @returns {Object} darkMode 상태와 관련 함수
 */
export const useDarkMode = () => useContext(DarkModeContext);

/**
 * 다크 모드 Provider 컴포넌트
 * @param {Object} props - 컴포넌트 props
 * @param {React.ReactNode} props.children - 자식 컴포넌트
 */
export const DarkModeProvider = ({ children }) => {
  // 로컬 스토리지에서 다크 모드 상태 초기화
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // 다크 모드 상태 변경 시 효과
  useEffect(() => {
    // body에 다크 모드 클래스 토글
    document.body.classList.toggle('dark-mode', darkMode);
    // 로컬 스토리지에 다크 모드 상태 저장
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  /**
   * 다크 모드 토글 함수
   * 서버에 테마 변경 요청을 보내고 상태를 업데이트합니다.
   */
  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    try {
      const response = await axios.post(
        'http://localhost:8090/tree/api/user/theme',
        { theme: newMode ? 'dark' : 'light' },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (response.data.theme) {
        setDarkMode(newMode);
      }
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  // Context Provider 반환
  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, setDarkMode }}>{children}</DarkModeContext.Provider>
  );
};
