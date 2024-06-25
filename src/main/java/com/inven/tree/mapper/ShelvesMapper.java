package com.inven.tree.mapper;

import com.inven.tree.model.Shelves;
<<<<<<< HEAD
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

public interface ShelvesMapper {
	// 선반 정보 불러오기
    List<Shelves> allShelves();
    
    @Transactional
    void deleteShelves(List<Integer> ids);
    
    //회사코드로 선반정보 추출
    List<Shelves> findByCorpIdx(String corpIdx);
=======

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.transaction.annotation.Transactional;


public interface ShelvesMapper {
    // 창고 식별자로 선반 정보 불러오기
    List<Shelves> selectAllShelves();
    
    // 선반 식별자로 선반 데이터 삭제(shelfIdx)
    @Transactional
    void deleteShelves(List<Integer> shelfIds);
    
       
    // 선반 정보 변경 또는 추가
    void updateOrInsertShelves(Shelves shelves);

>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
}
