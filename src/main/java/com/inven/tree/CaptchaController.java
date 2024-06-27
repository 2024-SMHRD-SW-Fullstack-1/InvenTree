package com.inven.tree;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CaptchaController {

    @Autowired
    private CaptchaService captchaService;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/api/captcha/key")
    public ResponseEntity<String> getCaptchaKey() {
        try {
            String captchaKey = captchaService.getCaptchaKey();
            return ResponseEntity.ok(captchaKey);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("CAPTCHA 키를 가져오는 중 오류가 발생했습니다.");
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/api/captcha/image/{key}")
    public ResponseEntity<String> getCaptchaImage(@PathVariable String key) {
        try {
            String captchaImage = captchaService.getCaptchaImage(key);
            return ResponseEntity.ok(captchaImage);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("CAPTCHA 이미지를 가져오는 중 오류가 발생했습니다.");
        }
    }
}
