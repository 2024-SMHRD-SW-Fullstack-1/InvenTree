import React from 'react';
import { Navigate } from 'react-router-dom';
import useSessionData from './useSessionData';

/**
 * PrivateRoute 컴포넌트는 보호된 경로를 렌더링하며, 사용자의 세션 데이터와 권한을 확인합니다.
 * @param {Object} props - 컴포넌트의 props.
 * @param {ReactNode} props.children - 보호된 경로에 렌더링될 자식 컴포넌트들.
 * @param {string} props.permission - 특정 권한을 요구하는 경우 해당 권한의 이름.
 * @returns {ReactNode} - 권한이 있는 경우 자식 컴포넌트들을 렌더링하고, 그렇지 않으면 적절한 페이지로 리디렉션.
 */
const PrivateRoute = ({ children, permission }) => {
  const sessionData = useSessionData(); // 세션 데이터를 가져오는 커스텀 훅을 사용.

  // 세션 데이터가 아직 로드되지 않은 경우 로딩 상태를 표시.
  if (sessionData === null) {
    return <div>Loading...</div>;
  }

  // 사용자 정보가 없으면 로그인 페이지로 리디렉션.
  if (!sessionData.user) {
    return <Navigate to="/login" />;
  }

  // 특정 권한이 요구되지만 사용자가 해당 권한을 가지고 있지 않은 경우 메인 페이지로 리디렉션.
  if (permission && sessionData[permission] !== 'Y') {
    alert('접근이 불가능합니다.');
    return <Navigate to="/main" />;
  }

  // 권한이 있는 경우 자식 컴포넌트들을 렌더링.
  return <>{children}</>;
};

export default PrivateRoute;
