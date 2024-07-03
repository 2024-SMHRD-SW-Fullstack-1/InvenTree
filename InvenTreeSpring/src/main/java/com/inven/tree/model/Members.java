package com.inven.tree.model;

public class Members {
    // 회원 아이디
    private String mbId; // pk

    // 회원 비밀번호
    private String mbPw;

    // 회원 이름
    private String mbName;

    // 회원 전화번호
    private String mbPhone;

    // 회원 테마 'dark', 'light'
    private String mbTheme;

    // 회사 코드
    private String corpIdx; // fk

    // 권한 식별자
    private int authIdx;

    // 가입 일자
    private String joinedAt;

    // 어드민 계정 Y/N
    private char isAdmin;

    // 기본 생성자
    public Members() {
    }
    
 // 권한 등급 (임시 필드)
    private String role;
    
    public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	// 캡차 생성자
    public Members(String mbId, String mbPw, String corpIdx) {
        this.mbId = mbId;
        this.mbPw = mbPw;
        this.corpIdx = corpIdx;
    }
    
    // 모든 필드를 포함한 생성자
    public Members(String mbId, String mbPw, String mbName, String mbPhone, String mbTheme, String corpIdx, int authIdx, String joinedAt, char isAdmin) {
        this.mbId = mbId;
        this.mbPw = mbPw;
        this.mbName = mbName;
        this.mbPhone = mbPhone;
        this.mbTheme = mbTheme;
        this.corpIdx = corpIdx;
        this.authIdx = authIdx;
        this.joinedAt = joinedAt;
        this.isAdmin = isAdmin;
    }

    // Getter와 Setter 메서드
    public String getMbId() {
        return mbId;
    }

    public void setMbId(String mbId) {
        this.mbId = mbId;
    }

    public String getMbPw() {
        return mbPw;
    }

    public void setMbPw(String mbPw) {
        this.mbPw = mbPw;
    }

    public String getMbName() {
        return mbName;
    }

    public void setMbName(String mbName) {
        this.mbName = mbName;
    }

    public String getMbPhone() {
        return mbPhone;
    }

    public void setMbPhone(String mbPhone) {
        this.mbPhone = mbPhone;
    }

    public String getMbTheme() {
        return mbTheme;
    }

    public void setMbTheme(String mbTheme) {
        this.mbTheme = mbTheme;
    }

    public String getCorpIdx() {
        return corpIdx;
    }

    public void setCorpIdx(String corpIdx) {
        this.corpIdx = corpIdx;
    }

    public int getAuthIdx() {
        return authIdx;
    }

    public void setAuthIdx(int authIdx) {
        this.authIdx = authIdx;
    }

    public String getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(String joinedAt) {
        this.joinedAt = joinedAt;
    }

    public char getIsAdmin() {
        return isAdmin;
    }

    public void setIsAdmin(char isAdmin) {
        this.isAdmin = isAdmin;
    }

    @Override
    public String toString() {
        return "Members{" +
                "mbId='" + mbId + '\'' +
                ", mbPw='" + mbPw + '\'' +
                ", mbName='" + mbName + '\'' +
                ", mbPhone='" + mbPhone + '\'' +
                ", mbTheme='" + mbTheme + '\'' +
                ", corpIdx='" + corpIdx + '\'' +
                ", authIdx=" + authIdx +
                ", joinedAt='" + joinedAt + '\'' +
                ", isAdmin=" + isAdmin +
                '}';
    }
}
