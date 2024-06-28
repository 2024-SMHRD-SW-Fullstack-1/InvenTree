package com.inven.tree.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.inven.tree.SessionInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**").allowedOrigins("http://localhost:3000") // 허용할 클라이언트 주소

				.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메소드

				.allowedHeaders("*") // 허용할 헤더
				.allowCredentials(true) // 인증 정보 허용 여부
				.maxAge(3600); // preflight 요청 최대 유효 기간 (초 단위)
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {

		// 새로운 인터셉터인 SessionInterceptor를 인터셉터 레지스트리에 등록
		// 이 인터셉터는 "/api/**" 경로에 매칭되는 모든 요청에 대해 동작
		registry.addInterceptor(new SessionInterceptor()).addPathPatterns("/api/**");

	}

	@Bean
	public CommonsMultipartResolver multipartResolver() {
		CommonsMultipartResolver resolver = new CommonsMultipartResolver();
		resolver.setDefaultEncoding("utf-8");
		resolver.setMaxUploadSize(1000000000); // 예: 최대 1MB
		return resolver;
	}
}
