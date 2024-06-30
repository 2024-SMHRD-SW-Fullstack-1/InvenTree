package com.inven.tree;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class SessionInterceptor implements HandlerInterceptor {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
	    HttpSession session = request.getSession(false);
	    if (session != null && session.getAttribute("user") != null) {
	        // 세션이 유효하면 세션 만료 시간을 갱신
	        session.setMaxInactiveInterval(30 * 60); // 30분
	        return true;
	    }
	    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	    return false;
	}
    
}
