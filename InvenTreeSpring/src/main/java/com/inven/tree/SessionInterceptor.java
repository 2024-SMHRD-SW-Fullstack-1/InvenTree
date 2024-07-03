package com.inven.tree;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class SessionInterceptor implements HandlerInterceptor {

    // 컨트롤러 실행 전에 호출되는 메서드
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 세션 가져오기 (세션이 없으면 null 반환)
    	HttpSession session = request.getSession(false);
        if (session != null) {
            // 세션 만료 시간을 30분으로 갱신 (30 * 60초)
            session.setMaxInactiveInterval(30*60); 
        }
        // 계속 처리하도록 true 반환
        return true;
    }
    
}
