package com.inven.tree.mapper;


import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Auths;

public interface AuthsMapper {
	// 권한 모두 불어오기
	List<Auths> selectAllAuths();
	
	// 권한 corpIdx로 조회하기
	List<Auths> selectAllAuthsByCorpIdx(@Param("corpIdx") String corpIdx);
	
    // 권한 정보 변경
    void updateAuth(Auths auths);
    
    // 권한 정보 삭제
    void deleteAuths(Auths auths);
    
    // 권한 정보 추가
    void insertAuths(Auths auths);
}
