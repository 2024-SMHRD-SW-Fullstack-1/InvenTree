package com.inven.tree;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://inventree.shop"}, allowCredentials = "true")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/api/notifications")
    public ResponseEntity<List<Map<String, String>>> getNotifications() {
        List<Map<String, String>> notifications = generateNotifications("1111");

        // 임의로 ETag를 설정합니다. (ETag는 고유해야 하므로, 실제로는 고유한 값을 생성해야 합니다)
        String eTagValue = "\"123456789\"";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setETag(eTagValue);

        return new ResponseEntity<>(notifications, headers, HttpStatus.OK);
    }

    private List<Map<String, String>> generateNotifications(String corpIdx) {
        List<Map<String, String>> notifications = new ArrayList<>();

        String bulkEntryNotifications = notificationService.checkForBulkEntries(corpIdx);
        String stockChangesNotifications = notificationService.checkForSignificantStockChanges(corpIdx);
        String abnormalStockChangesNotifications = notificationService.checkForAbnormalStockChanges(corpIdx);

        notifications.add(Map.of("type", "대량 입출고", "message", bulkEntryNotifications));
        notifications.add(Map.of("type", "재고 변동 상위 품목", "message", stockChangesNotifications));
        notifications.add(Map.of("type", "비정상적 재고 변동", "message", abnormalStockChangesNotifications));

        return notifications;
    }
}
