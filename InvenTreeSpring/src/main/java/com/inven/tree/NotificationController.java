package com.inven.tree;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class NotificationController {

    private final NotificationService notificationService;

    // NotificationService를 주입받는 생성자
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // 알림을 가져오는 GET 엔드포인트
    @GetMapping("/api/notifications")
    public ResponseEntity<List<Map<String, String>>> getNotifications(HttpSession session) {
        // 세션에서 corpIdx 가져오기
        String corpIdx = (String) session.getAttribute("corpIdx");
        
        // corpIdx가 null이면 기본값 설정 또는 에러 처리
        if (corpIdx == null) {
            // 에러 처리 예시
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        
        List<Map<String, String>> notifications = generateNotifications(corpIdx);
        // 임의로 ETag를 설정
        String eTagValue = "\"123456789\"";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setETag(eTagValue);
        return new ResponseEntity<>(notifications, headers, HttpStatus.OK);
    }

    // 알림을 생성하는 메서드
    private List<Map<String, String>> generateNotifications(String corpIdx) {
        List<Map<String, String>> notifications = new ArrayList<>();

        // 각 유형의 알림을 생성
        String bulkEntryNotifications = notificationService.checkForBulkEntries(corpIdx);
        String stockChangesNotifications = notificationService.checkForSignificantStockChanges(corpIdx);
        String abnormalStockChangesNotifications = notificationService.checkForAbnormalStockChanges(corpIdx);

        // 알림 유형 및 메시지를 Map 형태로 추가
        notifications.add(Map.of("type", "대량 입출고", "message", bulkEntryNotifications));
        notifications.add(Map.of("type", "재고 변동 상위 품목", "message", stockChangesNotifications));
        notifications.add(Map.of("type", "비정상적 재고 변동", "message", abnormalStockChangesNotifications));

        // 알림 목록 반환
        return notifications;
    }
}
