package com.inven.tree.mapper;

import com.inven.tree.model.Warehouses;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface WarehousesMapper {

	// corpIdx로 창고등록(창고 & 선반) 테이블 출력
    List<Warehouses> getWarehousesAndShelvesByCorpIdx(String corpIdx);
    
    // 창고 삭제
    void deleteWarehouses(@Param("warehouseIdsToDelete") List<Integer> whIds);
    
    // 창고 정보 변경
    void updateWarehouse(Warehouses warehouses);
    
    // 창고 추가
    void insertWarehouses(Warehouses warehouses);


}