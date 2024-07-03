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
		// reCAPTCHA 사이트 키를 저장하는 변수
		String recaptchaFilePath = "C:\\Users\\sr139\\OneDrive\\Desktop\\Project\\reCAPTCHA.txt"
				+ ""; // 파일 경로를 직접 지정
		
		// 파일에서 reCAPTCHA 키를 읽어와서 설정하는 부분
		try (BufferedReader reader = new BufferedReader(new FileReader(recaptchaFilePath))) {
			Properties properties = new Properties();
			properties.load(reader);
			siteKey = properties.getProperty("siteKey"); // 파일에서 siteKey를 읽어옴
			secretKey = properties.getProperty("secretKey"); // 파일에서 secretKey를 읽어옴
		} catch (IOException e) {
			e.printStackTrace(); // 예외 발생 시 스택 트레이스를 출력
			throw new RuntimeException("Failed to load reCAPTCHA keys from file"); // 예외를 던져서 초기화 실패를 알림
		}
	}
	
	// siteKey를 반환하는 getter 메서드
	public String getSiteKey() {
		return siteKey;
	}
	
	// secretKey를 반환하는 getter 메서드
	public String getSecretKey() {
		return secretKey;
	}
}
