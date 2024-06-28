package com.inven.tree.config;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Configuration;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;

@Configuration
public class RecaptchaConfig implements InitializingBean {

    private String siteKey;
    private String secretKey;

    @Override
    public void afterPropertiesSet() throws Exception {
        String recaptchaFilePath = "C:\\Users\\admin\\Documents\\workspace-sts-3.9.18.RELEASE\\Project\\reCAPTCHA.txt"; // 파일 경로를 직접 지정
        try (BufferedReader reader = new BufferedReader(new FileReader(recaptchaFilePath))) {
            Properties properties = new Properties();
            properties.load(reader);
            siteKey = properties.getProperty("siteKey");
            secretKey = properties.getProperty("secretKey");
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to load reCAPTCHA keys from file");
        }
    }

    public String getSiteKey() {
        return siteKey;
    }

    public String getSecretKey() {
        return secretKey;
    }
}
