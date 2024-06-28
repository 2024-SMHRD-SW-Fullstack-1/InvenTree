import React, { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import InventoryRegistration from './components/InventoryRegistration/InventoryRegistration';
import WarehouseLayout from './components/WarehouseLayout/WarehouseLayout';
import Statistics from './components/Statistics/Statistics';
import WarehouseRegistration from './components/WarehouseRegistration/WarehouseRegistration';
import Login from './components/Login/Login';
import Main from './components/Main/Main';
import AlertPage from './components/AlertPage/AlertPage'; // 경고 페이지 컴포넌트 추가
import ReleasesRegistration from './components/ReleasesRegistration/ReleasesRegistration';
import InoutHistory from './components/InoutHistory/InoutHistory';
import MembersRegistration from './components/MembersRegistration/MembersRegistration';
import InventoryStatus from './components/InventoryStatus/InventoryStatus';
import AuthsRegistration from './components/AuthsRegistration/AuthsRegistration';
import SubsidiariesRegistration from './components/SubsidiariesRegistration/SubsidiariesRegistration';

// 인증 컨텍스트 생성
const AuthContext = createContext();

// 인증 컨텍스트를 사용하기 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);

const App = () => {
  const location = useLocation(); // 현재 경로를 가져옴
  const navigate = useNavigate(); // 프로그래밍적으로 네비게이션하기 위해 사용
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // 로컬 스토리지에서 로그인 상태를 불러옴
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [sessionExpired, setSessionExpired] = useState(false); // 세션 만료 상태를 추적
  const [timeLeft, setTimeLeft] = useState(() => {
    // 로컬 스토리지에서 남은 시간을 불러옴
    const savedTimeLeft = localStorage.getItem('timeLeft');
    return savedTimeLeft ? parseInt(savedTimeLeft, 10) : null;
  });

  // 사용자 로그아웃 처리
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

  // 세션 타이머를 관리하기 위한 useEffect
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

  // 세션 갱신을 위한 useEffect
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

  // 세션 만료 시 로그아웃 처리
  useEffect(() => {
    if (sessionExpired) {
      window.alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      handleLogout();
    }
  }, [sessionExpired, handleLogout]);

  // 로그인 성공 시 호출되는 함수
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setTimeLeft(1800); // 로그인 성공 후 타이머를 30분으로 설정
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('timeLeft', 1800); // 남은 시간을 로컬 스토리지에 저장
  };

  const isLoginPage = location.pathname === '/login'; // 현재 경로가 로그인 페이지인지 확인
  const isAlertPage = location.pathname === '/alert'; // 현재 경로가 경고 페이지인지 확인

  return (
    <div>
      {!isLoginPage && !isAlertPage && <Header timeLeft={timeLeft} onLogout={handleLogout} />}{' '}
      {/* 로그인 페이지와 경고 페이지가 아닐 때 헤더를 표시 */}
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} /> {/* 로그인 경로 */}
        <Route path="/alert" element={<AlertPage />} /> {/* 경고 페이지 경로 */}
        <Route path="/main" element={isLoggedIn ? <Main /> : <Navigate to="/alert" />} /> {/* 메인 페이지 경로 */}
        <Route path="/statistics" element={isLoggedIn ? <Statistics /> : <Navigate to="/alert" />} />{' '}
        {/* 통계 페이지 경로 */}
        <Route
          path="/warehouse-layout"
          element={isLoggedIn ? <WarehouseLayout /> : <Navigate to="/alert" />} // 창고 배치도 페이지 경로
        />
        <Route
          path="/InventoryRegistration"
          element={isLoggedIn ? <InventoryRegistration /> : <Navigate to="/alert" />} // 재고 등록 페이지 경로 (중복)
        />
        <Route
          path="/InoutHistory"
          element={isLoggedIn ? <InoutHistory /> : <Navigate to="/alert" />} // 입출고 내역 페이지 경로
        />
        <Route
          path="/WarehouseRegistration"
          element={isLoggedIn ? <WarehouseRegistration /> : <Navigate to="/alert" />} // 창고 등록 페이지 경로
        />
        <Route
          path="/SubsidiariesRegistration"
          element={isLoggedIn ? <SubsidiariesRegistration /> : <Navigate to="/alert" />} // 업체 등록 페이지
        ></Route>
        <Route
          path="/AuthsRegistration"
          element={isLoggedIn ? <AuthsRegistration /> : <Navigate to="/alert" />} // 업체 등록 페이지
        ></Route>
        <Route
          path="/MembersRegistration"
          element={isLoggedIn ? <MembersRegistration /> : <Navigate to="/alert" />} // 사용자 등록 페이지
        ></Route>
        <Route
          path="/InventoryStatus"
          element={isLoggedIn ? <InventoryStatus /> : <Navigate to="/alert" />} // 재고 현황 페이지 경로
        />
        <Route
          path="/ReleasesRegistration"
          element={isLoggedIn ? <ReleasesRegistration /> : <Navigate to="/alert" />} // 출고 등록 페이지 경로 (중복)
        />
        <Route path="/" element={<Navigate to="/login" />} /> {/* 기본 경로 */}
      </Routes>
    </div>
  );
};

export default App;
