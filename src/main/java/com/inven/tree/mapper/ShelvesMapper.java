package com.inven.tree.mapper;

import com.inven.tree.model.Shelves;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

public interface ShelvesMapper {
	// 선반 정보 불러오기
    List<Shelves> allShelves();
    
    @Transactional
    void deleteShelves(List<Integer> ids);
    
    //회사코드로 선반정보 추출
    List<Shelves> findByCorpIdx(String corpIdx);
}
