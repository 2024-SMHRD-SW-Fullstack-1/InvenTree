import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from './UserInfoPanel.module.css';

const UserInfoPanel = () => {
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태
  const [error, setError] = useState(''); // 오류 메시지 상태

  useEffect(() => {
    // 사용자 정보를 가져오는 비동기 함수
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8090/tree/api/userInfo', { withCredentials: true }); // 사용자 정보 API 호출
        setUserInfo(response.data); // 사용자 정보 상태 업데이트
      } catch (error) {
        console.error('Failed to fetch user info:', error); // 오류 로그 출력
        setError('Failed to fetch user info'); // 오류 메시지 상태 업데이트
      }
    };

    fetchUserInfo(); // 컴포넌트가 마운트될 때 사용자 정보를 가져옴
  }, []); // 의존성 배열이 빈 배열이므로 한 번만 실행

  if (error) {
    return alert({ error }); // 오류가 발생하면 경고창 표시
  }

  if (!userInfo) {
    return null; // 사용자 정보가 없으면 null 반환
  }

  return (
    <div className={style.userInfo}>
      <span className={style.InfoTitle}>사용자 정보</span>
      <div className={style.InfoContents}>
        <p>
          <span className={style.leftContent}>회사코드</span>
          <span className={style.rightContent}>{userInfo.corpIdx}</span>
        </p>
        <p>
          <span className={style.leftContent}>아이디</span>
          <span className={style.rightContent}>{userInfo.mbId}</span>
        </p>
        <p>
          <span className={style.leftContent}>이름</span>
          <span className={style.rightContent}>{userInfo.mbName}</span>
        </p>
        <p>
          <span className={style.leftContent}>전화번호</span>
          <span className={style.rightContent}>{userInfo.mbPhone}</span>
        </p>
        <p>
          <span className={style.leftContent}>권한등급</span>
          <span className={style.rightContent}>{userInfo.role}</span>
        </p>
      </div>
    </div>
  );
};

export default UserInfoPanel;
