package com.inven.tree;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class HomeController {
	
	// 서버 연결 확인용
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home() {
		System.out.println("server on");
		return "home";
	}
	
	
}
