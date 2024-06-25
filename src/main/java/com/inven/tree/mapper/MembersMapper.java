package com.inven.tree.mapper;

import com.inven.tree.model.Members;
import java.util.List;

public interface MembersMapper {
	// 로그인
	int login(Members members);
    
	// 회원 검색
	List<Members> findAll();   
}
