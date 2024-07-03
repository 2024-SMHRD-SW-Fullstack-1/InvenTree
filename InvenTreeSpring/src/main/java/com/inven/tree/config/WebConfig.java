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
	
	// CORS 설정을 추가하는 메서드
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // /api/** 경로에 대해 CORS 설정 적용
            .allowedOrigins("http://localhost:3000") // 허용할 출처
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 허용할 HTTP 메서드
            .allowedHeaders("*") // 허용할 헤더
            .allowCredentials(true) // 자격 증명 허용
            .maxAge(3600); // 캐시 유효 시간 (초 단위)
    }

    // 인터셉터를 등록하는 메서드
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SessionInterceptor()).addPathPatterns("/api/**"); // /api/** 경로에 대해 SessionInterceptor 적용
    }

    // 파일 업로드를 위한 CommonsMultipartResolver 빈을 생성하는 메서드
    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver resolver = new CommonsMultipartResolver();
        resolver.setDefaultEncoding("utf-8"); // 기본 인코딩 설정
        resolver.setMaxUploadSize(1000000000); // 최대 업로드 파일 크기 설정
        return resolver;
    }
}
