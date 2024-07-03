/**
 * @fileoverview 애플리케이션의 헤더 컴포넌트.
 * 네비게이션 메뉴, 사용자 정보, 알림, 로그아웃 기능을 포함합니다.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './Header.module.css';
// 아이콘 및 이미지 임포트
import inventoryIcon from '../../assets/images/재고L.png';
import inoutIcon from '../../assets/images/입출고L.png';
import statisticsIcon from '../../assets/images/통계L.png';
import settingsIcon from '../../assets/images/설정L.png';
import userIcon from '../../assets/images/사용자L.png';
import notificationIcon from '../../assets/images/알림L.png';
import powerIcon from '../../assets/images/로그아웃L.png';
// 컴포넌트 임포트
import NotificationPanel from '../NotificationPanel/NotificationPanel';
import { useDarkMode } from '../DarkMode/DarkModeContext';
import DarkModeToggle from '../DarkMode/DarkModeToggle';
import UserInfo from '../UserInfoPanel/UserInfoPanel';

/**
 * Header 컴포넌트
 * @param {number} timeLeft - 남은 시간 (초)
 * @param {function} onLogout - 로그아웃 핸들러 함수
 * @return {React.Component} 헤더 컴포넌트
 */
const Header = ({ timeLeft, onLogout }) => {
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const { darkMode } = useDarkMode();

  /**
   * 알림 아이콘 클릭 핸들러
   */
  const handleNotificationIconClick = () => {
    console.log('Notification icon clicked');
    setNotificationOpen((prev) => !prev);
  };

  /**
   * 시간을 포맷팅하는 함수
   * @param {number} seconds - 초 단위의 시간
   * @return {string} 포맷팅된 시간 문자열
   */
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  /**
   * 사용자 정보 팝업 토글 함수
   */
  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };

  /**
   * 메뉴 마우스 오버 핸들러
   * @param {string} menu - 활성화할 메뉴 이름
   */
  const handleMouseEnter = (menu) => {
    setActiveMenu(menu);
  };

  /**
   * 메뉴 마우스 아웃 핸들러
   */
  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  return (
    <div className={`${style.headerContainer} ${darkMode ? style.darkMode : ''}`}>
      <div className={style.header}>
        {/* 로고 및 좌측 헤더 */}
        <div className={style.headerLeft}>
          <Link to="/main" className={style.logoLink}>
            <span className={style.logoText}>InvenTree</span>
          </Link>
        </div>

        {/* 중앙 메뉴 아이콘 */}
        <div className={style.headerIcons}>
          {/* 재고 메뉴 */}
          <div
            className={`${style.menuItem} ${style.firstMenuItem}`}
            onMouseEnter={() => handleMouseEnter('inventory')}
            onMouseLeave={handleMouseLeave}
          >
            <img src={inventoryIcon} alt="Inventory" />
            {activeMenu === 'inventory' && (
              <div className={style.dropdownContent}>
                <Link to="/InventoryStatus">재고현황</Link>
                <Link to="/warehouseLayout">창고 배치도</Link>
              </div>
            )}
          </div>
          {/* 입출고 메뉴 */}
          <div
            className={style.menuItem}
            onMouseEnter={() => handleMouseEnter('inout')}
            onMouseLeave={handleMouseLeave}
          >
            <img src={inoutIcon} alt="InOut" />
            {activeMenu === 'inout' && (
              <div className={style.dropdownContent}>
                <Link to="/InventoryRegistration">입고 등록</Link>
                <Link to="/ReleasesRegistration">출고 등록</Link>
                <Link to="/InoutHistory">입출고 내역</Link>
              </div>
            )}
          </div>
          {/* 통계 메뉴 */}
          <div
            className={style.menuItem}
            onMouseEnter={() => handleMouseEnter('statistics')}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/statistics">
              <img src={statisticsIcon} alt="Statistics" />
            </Link>
          </div>
          {/* 설정 메뉴 */}
          <div
            className={`${style.menuItem} ${style.lastMenuItem}`}
            onMouseEnter={() => handleMouseEnter('settings')}
            onMouseLeave={handleMouseLeave}
          >
            <img src={settingsIcon} alt="Settings" />
            {activeMenu === 'settings' && (
              <div className={style.dropdownContent}>
                <Link to="/SubsidiariesRegistration">업체 등록</Link>
                <Link to="/WarehouseRegistration">창고 등록</Link>
                <Link to="/MembersRegistration">사용자 관리</Link>
                <Link to="/AuthsRegistration">권한 설정 변경</Link>
              </div>
            )}
          </div>
        </div>

        {/* 우측 헤더 아이콘 */}
        <div className={style.headerRight}>
          {/* 사용자 정보 아이콘 */}
          <div className={style.iconContainer} onClick={toggleUserInfo}>
            <img src={userIcon} alt="User" className={style.headerRightIcon} />
            {showUserInfo && <UserInfo className={style.headerRightIcon} />}
          </div>

          <DarkModeToggle />

          {/* 알림 아이콘 */}
          <div className={style.iconContainer} onClick={handleNotificationIconClick}>
            <img src={notificationIcon} alt="Notification" className={style.headerRightIcon} />
            {notificationOpen && <NotificationPanel />}
          </div>

          {/* 로그아웃 아이콘 */}
          <img
            src={powerIcon}
            alt="Power"
            className={`${style.headerRightIcon} ${style.logoutIcon}`}
            onClick={onLogout}
          />

          {/* 남은 시간 표시 */}
          <span className={style.time}>{formatTime(timeLeft)}</span>
        </div>
      </div>
      {/* 배경 블러 효과 */}
      {activeMenu && <div className={style.blurBackground} />}
    </div>
  );
};

export default Header;
