package com.inven.tree.mapper;


import java.util.List;

import com.inven.tree.model.Auths;

public interface AuthsMapper {
	
	// 권한 corpIdx로 조회하기
	List<Auths> selectAllAuthsByCorpIdx(String corpIdx);
	
    // 권한 정보 변경
    void updateAuth(Auths auths);
    
    // 권한 정보 삭제
    void deleteAuths(Auths auths);
    
    // 권한 정보 추가
    void insertAuths(Auths auths);
    
    // 권한 정보 확인(특정 mbId) - 로그인 권한 설정
    Auths getAuthsByMbId(String mbId);
    
}
