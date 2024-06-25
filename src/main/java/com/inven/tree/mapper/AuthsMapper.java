package com.inven.tree.mapper;


import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Auths;
import com.inven.tree.model.Shelves;


public interface AuthsMapper {
	// 권한 모두 불어오기
	List<Auths> selectAllAuths();
	
	List<Auths> selectAllAuthsByCorpIdx(@Param("corpIdx") String corpIdx);
	
    // 권한 정보 변경
    void updateAuth(Auths auths);
    
    void deleteAuths(Auths auths);
    
    void insertAuths(Auths auths);
}
