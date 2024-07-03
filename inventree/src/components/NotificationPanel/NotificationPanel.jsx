import React from "react";
import { Link } from "react-router-dom";
import style from "./NotificationPanel.module.css";
import notificationIcon2 from "../../assets/images/알림2.png";
import notificationIcon3 from "../../assets/images/알림3.png";

const NotificationPanel = () => {
    const notifications = [
        {
            id: 1,
            date: "2024-06-25",
            summary: "재고현황이 업데이트 되었습니다.",
            description: "2024년 6월 25일에 재고현황이 업데이트 되었습니다.",
            type: "재고현황",
            link: "/inventory",
        },
        {
            id: 2,
            date: "2024-06-24",
            summary: "출고 처리가 완료되었습니다.",
            description: "2024년 6월 24일에 출고 처리가 완료되었습니다.",
            type: "출고 내역",
            link: "/shipment",
        },
        {
            id: 3,
            date: "2024-06-23",
            summary: "새로운 공지사항이 있습니다.",
            description: "2024년 6월 23일에 새로운 공지사항이 등록되었습니다.",
            type: "공지사항",
            link: "/announcement",
        },
        {
            id: 4,
            date: "2024-06-22",
            summary: "정기 점검이 예정되어 있습니다.",
            description: "2024년 6월 22일에 정기 점검이 예정되어 있습니다.",
            type: "정기 점검",
            link: "/maintenance",
        },
        // 추가적인 알림 메시지들을 여기에 추가
    ];

    const handleNotificationClick = (link) => {
        // 클릭한 알림에 따라 해당 페이지로 이동
        console.log(`Navigating to ${link}`);
        // history.push(link); // 필요에 따라 라우팅 처리
    };

    return (
        <div className={style.notificationPanel}>
            <div className={style.header}>
                <img src={notificationIcon2} className={style.notificationIcon2} alt="Notification Icon" />
                <span className={style.title}>스마트 알림</span>
            </div>
            {notifications.map((notification) => (
                <Link to={`${notification.link}`} key={notification.id} className={style.notificationLink}>
                    <div
                        key={notification.id}
                        className={style.notificationItem}
                        onClick={() => handleNotificationClick(`/${notification.type}`)}
                    >
                        <div className={style.notificationDetails}>
                            <div className={style.notificationDate}>
                                <img
                                    src={notificationIcon3}
                                    className={style.notificationicon3}
                                    alt="Notification Icon"
                                />
                                <p>{notification.date}</p>
                            </div>
                            <p className={style.notificationSummary}>{notification.summary}</p>
                            <p className={style.notificationDescription}>{notification.description}</p>
                            <p className={style.notificationType}>{notification.type}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default NotificationPanel;
