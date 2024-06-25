package com.inven.tree.mapper;

import com.inven.tree.model.Shelves;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.transaction.annotation.Transactional;


public interface ShelvesMapper {
    // 창고 식별자로 선반 정보 불러오기
    List<Shelves> selectAllShelves();
    
    List<Shelves> selectAllShelvesBywhIdx(@Param("warehouseIdsToDelete") List<Integer> whIdx);
    
    // 선반 식별자로 선반 데이터 삭제(shelfIdx)
    @Transactional
    void deleteShelvesByShelfIdxAndWhIdx(@Param("shelfIdsToDelete") List<Integer> shelfIds, @Param("warehouseIdsToDelete") List<Integer> whIds);
    
       
    // 선반 정보 변경 또는 추가
    void updateShelf(Shelves shelves);

}
