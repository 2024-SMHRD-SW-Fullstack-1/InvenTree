package com.inven.tree.mapper;


import java.util.List;

import com.inven.tree.model.Auths;


public interface AuthsMapper {
	//권한 모두 불어오기
	List<Auths> selectAllAuths();
	
	
}
