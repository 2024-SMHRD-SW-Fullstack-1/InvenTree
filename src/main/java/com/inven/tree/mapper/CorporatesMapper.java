package com.inven.tree.mapper;

import com.inven.tree.model.Corporates;
import java.util.List;

public interface CorporatesMapper {
	// 회사 정보 모두 불러오기
<<<<<<< HEAD
	List<Corporates> selectAllCorporates();
    
=======
	List<Corporates> selectAllCorporates(String corpIdx);
    
	void updateCorporates(Corporates corporates);
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
}
