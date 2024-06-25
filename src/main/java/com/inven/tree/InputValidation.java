package com.inven.tree;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class InputValidation {

    private static final String ID_PATTERN = 
        "^[A-Za-z0-9+_.-]{4,20}$"; // 예시 패턴: 4~20자의 영숫자 및 특수문자
    private static final String PASSWORD_PATTERN = 
        "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,20}$"; // 예시 패턴: 숫자, 문자, 특수문자가 포함된 8~20자의 비밀번호
    private static final String CORP_CODE_PATTERN = 
        "^[A-Za-z0-9]{4,10}$"; // 예시 패턴: 4~10자의 영숫자

    private Pattern idPattern;
    private Pattern passwordPattern;
    private Pattern corpCodePattern;
    private Matcher matcher;

    public InputValidation() {
        idPattern = Pattern.compile(ID_PATTERN);
        passwordPattern = Pattern.compile(PASSWORD_PATTERN);
        corpCodePattern = Pattern.compile(CORP_CODE_PATTERN);
    }

    public boolean validateMbId(String mbId) {
        if (mbId == null) return false;
        matcher = idPattern.matcher(mbId);
        return matcher.matches();
    }

    public boolean validatePassword(String password) {
        if (password == null) return false;
        matcher = passwordPattern.matcher(password);
        return matcher.matches();
    }

    public boolean validateCorpCode(String corpCode) {
        if (corpCode == null) return false;
        matcher = corpCodePattern.matcher(corpCode);
        return matcher.matches();
    }
}
