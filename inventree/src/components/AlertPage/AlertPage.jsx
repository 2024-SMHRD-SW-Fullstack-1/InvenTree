/**
 * @fileoverview 로그인이 필요한 페이지에 대한 알림을 표시하는 컴포넌트.
 * @author Your Name
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from './AlertPage.module.css';

/**
 * 로그인이 필요한 페이지에 잘못 접근했을 때 표시되는 알림 페이지 컴포넌트.
 * @return {React.Component} 알림 페이지 컴포넌트
 */
const AlertPage = () => {
  const navigate = useNavigate();

  /**
   * 로그인 페이지로 이동하는 함수.
   */
  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className={style.alertContainer}>
      <h2>잘못된 접근입니다</h2>
      <p>로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다.</p>
      <button onClick={handleGoToLogin}>로그인 페이지로 이동</button>
    </div>
  );
};

export default AlertPage;
