import React, { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import InventoryRegistration from './components/InventoryRegistration/InventoryRegistration';
import WarehouseLayout from './components/WarehouseLayout/WarehouseLayout';
import Statistics from './components/Statistics/Statistics';
import WarehouseRegistration from './components/WarehouseRegistration/WarehouseRegistration';
import Login from './components/Login/Login';
import Main from './components/Main/Main';
import AlertPage from './components/AlertPage/AlertPage';
import ReleasesRegistration from './components/ReleasesRegistration/ReleasesRegistration';
import InoutHistory from './components/InoutHistory/InoutHistory';
import MembersRegistration from './components/MembersRegistration/MembersRegistration';
import InventoryStatus from './components/InventoryStatus/InventoryStatus';
import AuthsRegistration from './components/AuthsRegistration/AuthsRegistration';
import SubsidiariesRegistration from './components/SubsidiariesRegistration/SubsidiariesRegistration';
import PrivateRoute from './PrivateRoute';
import useSessionData from './useSessionData';
import { DarkModeProvider } from './components/DarkMode/DarkModeContext';

// 인증 컨텍스트 생성
const AuthContext = createContext();

// 인증 컨텍스트를 사용하기 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);

const App = () => {
  const sessionData = useSessionData();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [sessionExpired, setSessionExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTimeLeft = localStorage.getItem('timeLeft');
    return savedTimeLeft ? parseInt(savedTimeLeft, 10) : null;
  });

  const handleLogout = useCallback(async () => {
    await fetch('http://localhost:8090/tree/api/logout', {
      method: 'POST',
      credentials: 'include',
    });

    setSessionExpired(false);
    setTimeLeft(null);
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('timeLeft');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const savedSessionData = localStorage.getItem('sessionData');
    if (savedSessionData) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem('sessionData', JSON.stringify(sessionData));
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem('sessionData');
      localStorage.removeItem('isLoggedIn');
    }
  }, [isLoggedIn, sessionData]);

  useEffect(() => {
    let interval;
    if (timeLeft !== null) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            setSessionExpired(true);
            return 0;
          }
          localStorage.setItem('timeLeft', newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    const renewSession = async () => {
      await fetch('http://localhost:8090/tree/api/checkSession', {
        method: 'GET',
        credentials: 'include',
      });
    };

    if (location.pathname !== '/login') {
      renewSession();
    }
  }, [location]);

  useEffect(() => {
    if (sessionExpired) {
      window.alert('30분이 지나 자동으로 로그아웃 됩니다. 다시 로그인해주세요.');
      handleLogout();
    }
  }, [sessionExpired, handleLogout]);

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    setTimeLeft(1800);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('timeLeft', 1800);

    // 사용자의 테마 설정 가져오기
    try {
      const themeResponse = await fetch('http://localhost:8090/tree/api/user/theme', {
        method: 'GET',
        credentials: 'include',
      });
      const themeData = await themeResponse.json();

      // 테마 적용
      if (themeData.theme === 'dark') {
        localStorage.setItem('darkMode', 'true');
      } else {
        localStorage.setItem('darkMode', 'false');
      }
    } catch (error) {
      console.error('Error fetching user theme:', error);
    }
  };

  const isLoginPage = location.pathname === '/login';
  const isAlertPage = location.pathname === '/alert';

  return (
    <DarkModeProvider>
      <AuthContext.Provider value={{ isLoggedIn, handleLogout }}>
        {!isLoginPage && !isAlertPage && isLoggedIn && <Header timeLeft={timeLeft} onLogout={handleLogout} />}
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/alert" element={<AlertPage />} />
          <Route path="/main" element={isLoggedIn ? <Main /> : <Navigate to="/alert" />} />
          <Route
            path="/statistics"
            element={
              <PrivateRoute permission="chartYn">
                <Statistics />
              </PrivateRoute>
            }
          />
          <Route
            path="/main"
            element={
              <PrivateRoute permission="inventoryYn">
                <WarehouseLayout />
              </PrivateRoute>
            }
          />
          <Route
            path="/InventoryRegistration"
            element={
              <PrivateRoute permission="shipYn">
                <InventoryRegistration />
              </PrivateRoute>
            }
          />
          <Route
            path="/WarehouseLayout"
            element={
              <PrivateRoute permission="shipYn">
                <WarehouseLayout />
              </PrivateRoute>
            }
          />
          <Route
            path="/InoutHistory"
            element={
              <PrivateRoute permission="shipYn">
                <InoutHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/WarehouseRegistration"
            element={
              <PrivateRoute permission="setYn">
                <WarehouseRegistration />
              </PrivateRoute>
            }
          />
          <Route
            path="/SubsidiariesRegistration"
            element={
              <PrivateRoute permission="setYn">
                <SubsidiariesRegistration />
              </PrivateRoute>
            }
          />
          <Route
            path="/AuthsRegistration"
            element={
              <PrivateRoute permission="setYn">
                <AuthsRegistration />
              </PrivateRoute>
            }
          />
          <Route
            path="/MembersRegistration"
            element={
              <PrivateRoute permission="setYn">
                <MembersRegistration />
              </PrivateRoute>
            }
          />
          <Route
            path="/InventoryStatus"
            element={
              <PrivateRoute permission="inventoryYn">
                <InventoryStatus />
              </PrivateRoute>
            }
          />
          <Route
            path="/ReleasesRegistration"
            element={
              <PrivateRoute permission="shipYn">
                <ReleasesRegistration />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthContext.Provider>
    </DarkModeProvider>
  );
};

export default App;
