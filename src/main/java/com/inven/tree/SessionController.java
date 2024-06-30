package com.inven.tree;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/session")
@CrossOrigin(origins="http://localhost:3000", allowCredentials="true")
public class SessionController {

    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getSessionData(HttpSession session) {
        Map<String, Object> sessionData = new HashMap<>();
        sessionData.put("user", session.getAttribute("user"));
        sessionData.put("mdId", session.getAttribute("mdId"));
        sessionData.put("corpIdx", session.getAttribute("corpIdx"));
        sessionData.put("inventoryYn", session.getAttribute("inventoryYn"));
        sessionData.put("shipYn", session.getAttribute("shipYn"));
        sessionData.put("chartYn", session.getAttribute("chartYn"));
        sessionData.put("setYn", session.getAttribute("setYn"));
        sessionData.put("theme", session.getAttribute("theme"));  // 테마 정보 추가
        return ResponseEntity.ok(sessionData);
    }
}
