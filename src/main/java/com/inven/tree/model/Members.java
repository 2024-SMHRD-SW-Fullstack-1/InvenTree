package com.inven.tree.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
//회원 테이블
public class Members {
	// 회원 아이디 
    private String mbId; //pk

    // 회원 비밀번호 
    private String mbPw;

    // 회원 이름 
    private String mbName;

    // 회원 전화번호 
    private String mbPhone;

    // 회원 테마 'dark', 'light'
    private String mbTheme;

    // 회사 코드 
    private String corpIdx; //fk
    
    // 가입 일자
    private String joinedAt; // 새로 추가된 필드
}
