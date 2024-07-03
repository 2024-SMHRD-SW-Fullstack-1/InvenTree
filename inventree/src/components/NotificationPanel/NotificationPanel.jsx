import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import style from './NotificationPanel.module.css';
import notificationIcon2 from '../../assets/images/알림2.png';
import notificationIcon3 from '../../assets/images/알림3.png';

/**
 * NotificationPanel 컴포넌트
 * 사용자에게 알림을 표시하는 패널입니다.
 */
const NotificationPanel = () => {
  // 상태 변수 선언
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [etag, setEtag] = useState(null); // ETag 상태 추가

  const uniqueIdRef = useRef(0);
  const prevNotifications = useRef([]);
  const isInitialRender = useRef(true);
  const panelRef = useRef(null);
  const scrollPosition = useRef(0);

  /**
   * 알림 데이터를 주기적으로 가져오는 함수
   */
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8090/tree/api/notifications', {
          method: 'GET',
          headers: {
            'If-None-Match': etag || '',
          },
          credentials: 'include',
        });

        if (response.status === 304) {
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        const newEtag = response.headers.get('ETag');
        setEtag(newEtag);

        handleNewNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const intervalId = setInterval(fetchNotifications, 30000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
    // handleNewNotifications에 의존도를 넣으면 오히려 렌더링 느려지므로 절대 넣지 말것!!
  }, [etag]);

  /**
   * 새로운 알림을 처리하는 함수
   * @param {Array} data - 새로운 알림 데이터
   */
  const handleNewNotifications = (data) => {
    const newNotifications = data.flatMap((item) => {
      const { type, message } = item;
      return message
        .split('\n')
        .filter((n) => n.trim())
        .map((n) => ({
          id: uniqueIdRef.current++,
          date: new Date().toISOString().split('T')[0],
          summary: n,
          description: n,
          type: type,
          link: getLinkFromType(type),
        }));
    });

    const hasChanges = !isEqual(newNotifications, prevNotifications.current);

    if (hasChanges || isInitialRender.current) {
      setNotifications(newNotifications);
      prevNotifications.current = newNotifications;
      isInitialRender.current = false;

      // 알림을 localStorage에 저장
      localStorage.setItem('notifications', JSON.stringify(newNotifications));

      if (panelRef.current) {
        panelRef.current.scrollTop = scrollPosition.current;
      }
    }
  };

  /**
   * 알림 유형에 따라 링크를 반환하는 함수
   * @param {string} type - 알림 유형
   * @returns {string} 링크 URL
   */
  const getLinkFromType = (type) => {
    if (type === '대량 입출고') return '/InoutHistory';
    if (type === '재고 변동 상위 품목') return '/InventoryStatus';
    if (type === '비정상적 재고 변동') return '/InventoryStatus';
    return '/main';
  };

  return (
    <div className={style.notificationPanel} ref={panelRef} style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <div className={style.header}>
        <img src={notificationIcon2} className={style.notificationIcon2} alt="Notification Icon" />
        <span className={style.title}>스마트 알림</span>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        notifications
          .filter((notification) => notification)
          .map((notification) => (
            <Link to={notification?.link || '/'} key={notification.id} className={style.notificationLink}>
              <div className={style.notificationItem}>
                <div className={style.notificationDetails}>
                  <div className={style.notificationDate}>
                    <img src={notificationIcon3} className={style.notificationIcon3} alt="Notification Icon" />
                    <p>{notification.date}</p>
                  </div>
                  <p className={style.notificationSummary}>{notification.summary}</p>
                  <p className={style.notificationDescription}>{notification.description}</p>
                  <p className={style.notificationType}>{notification.type}</p>
                </div>
              </div>
            </Link>
          ))
      )}
    </div>
  );
};

export default NotificationPanel;
