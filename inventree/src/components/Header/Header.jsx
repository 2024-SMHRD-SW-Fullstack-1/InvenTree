import React, { useState } from "react";
import { Link } from "react-router-dom";
import style from "./Header.module.css";
import inventoryIcon from "../../assets/images/재고L.png";
import inoutIcon from "../../assets/images/입출고L.png";
import statisticsIcon from "../../assets/images/통계L.png";
import settingsIcon from "../../assets/images/설정L.png";
import userIcon from "../../assets/images/사용자L.png";
import lightIcon from "../../assets/images/사용자관리L.png";
import notificationIcon from "../../assets/images/알림L.png";
import powerIcon from "../../assets/images/로그아웃L.png";
import NotificationPanel from "../NotificationPanel/NotificationPanel";

const Header = ({ timeLeft, onLogout }) => {
    const [notificationOpen, setNotificationOpen] = useState(false);

    const handleNotificationIconClick = () => {
        console.log("Notification icon clicked");

        setNotificationOpen((prev) => !prev);
    };

    const [activeMenu, setActiveMenu] = useState(null);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const handleMouseEnter = (menu) => {
        setActiveMenu(menu);
    };

    const handleMouseLeave = () => {
        setActiveMenu(null);
    };

    return (
        <div className={style.headerContainer}>
            <div className={style.header}>
                <div className={style.headerLeft}>
                    <Link to="/main" className={style.logoLink}>
                        <span className={style.logoText}>InvenTree</span>
                    </Link>
                </div>
                <div className={style.headerIcons}>
                    <div
                        className={`${style.menuItem} ${style.firstMenuItem}`}
                        onMouseEnter={() => handleMouseEnter("inventory")}
                        onMouseLeave={handleMouseLeave}
                    >
                        <img src={inventoryIcon} alt="Inventory" />
                        {activeMenu === "inventory" && (
                            <div className={style.dropdownContent}>
                                <Link to="/InventoryStatus">재고현황</Link>
                                <Link to="/warehouse-layout">창고 배치도</Link>
                            </div>
                        )}
                    </div>
                    <div
                        className={style.menuItem}
                        onMouseEnter={() => handleMouseEnter("inout")}
                        onMouseLeave={handleMouseLeave}
                    >
                        <img src={inoutIcon} alt="InOut" />
                        {activeMenu === "inout" && (
                            <div className={style.dropdownContent}>
                                <Link to="/InventoryRegistration">입고 등록</Link>
                                <Link to="/ReleasesRegistration">출고 등록</Link>
                                <Link to="/InoutHistory">입출고 내역</Link>
                            </div>
                        )}
                    </div>
                    <div
                        className={style.menuItem}
                        onMouseEnter={() => handleMouseEnter("statistics")}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link to="/statistics">
                            <img src={statisticsIcon} alt="Statistics" />
                        </Link>
                    </div>
                    <div
                        className={`${style.menuItem} ${style.lastMenuItem}`}
                        onMouseEnter={() => handleMouseEnter("settings")}
                        onMouseLeave={handleMouseLeave}
                    >
                        <img src={settingsIcon} alt="Settings" />
                        {activeMenu === "settings" && (
                            <div className={style.dropdownContent}>
                                <Link to="/SubsidiariesRegistration">업체 등록</Link>
                                <Link to="/WarehouseRegistration">창고 등록</Link>
                                <Link to="/AuthsRegistration">권한 설정 변경</Link>
                                <Link to="/MembersRegistration">사용자 관리</Link>
                            </div>
                        )}
                    </div>
                </div>
                <div className={style.headerRight}>
                    <img src={userIcon} alt="User" className={style.headerRightIcon} />
                    <img src={lightIcon} alt="Light" className={style.headerRightIcon} />
                    <div className={style.NotificationIconContainer} onClick={handleNotificationIconClick}>
                        <img src={notificationIcon} alt="Notification" className={style.headerRightIcon} />
                        {notificationOpen && <NotificationPanel />}
                    </div>
                    <img
                        src={powerIcon}
                        alt="Power"
                        className={`${style.headerRightIcon} ${style.logoutIcon}`}
                        onClick={onLogout}
                    />
                    <span className={style.time}>{formatTime(timeLeft)}</span>
                </div>
            </div>
            {activeMenu && <div className={style.blurBackground} />}
        </div>
    );
};

export default Header;
