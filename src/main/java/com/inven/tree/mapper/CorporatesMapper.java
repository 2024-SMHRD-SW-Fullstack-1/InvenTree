package com.inven.tree.mapper;

import com.inven.tree.model.Corporates;
import java.util.List;

public interface CorporatesMapper {
	// 회사 정보 모두 불러오기
	List<Corporates> selectAllCorporates(String corpIdx);
    
	void updateCorporates(Corporates corporates);
}
