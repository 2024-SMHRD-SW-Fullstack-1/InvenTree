package com.inven.tree.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CaptchaConfig {

    @Value("${naver.captcha.clientId}")
    private String clientId;

    @Value("${naver.captcha.clientSecret}")
    private String clientSecret;

    // 세터 메서드 추가
    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    // 게터 메서드
    public String getClientId() {
        return clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }
}
