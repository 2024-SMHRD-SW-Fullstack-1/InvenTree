import React from "react";
import { useNavigate } from "react-router-dom";
import style from "./AlertPage.module.css"; // 스타일링을 위한 CSS 모듈 사용

const AlertPage = () => {
    const navigate = useNavigate();

    const handleGoToLogin = () => {
        navigate("/login");
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
