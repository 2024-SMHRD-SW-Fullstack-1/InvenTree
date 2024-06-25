package com.inven.tree.mapper;

import com.inven.tree.model.Warehouses;

import java.util.List;

import org.apache.ibatis.annotations.Param;

public interface WarehousesMapper {
    // 모든 창고 정보 불러오기
    List<Warehouses> allWarehouses();
    
    // corpIdx로 창고 등록 (창고 & 선반) 테이블 출력
    List<Warehouses> getWarehousesAndShelvesByCorpIdx(String corpIdx);

    // 창고 삭제
    void deleteWarehouses(@Param("warehouseIdsToDelete") List<Integer> whIds);

    // 창고 정보 변경
    void updateWarehouse(Warehouses warehouse);

    // corpIdx로 창고 조회
    List<Warehouses> selectAllWarehouses(@Param("corpIdx") String corpIdx);

    // 창고 정보 변경
    void updateWarehouses(Warehouses warehouse);

    // 창고 추가
    void addWarehouse(Warehouses warehouse);

    // 창고 추가
    void insertWarehouses(Warehouses warehouse);
}
