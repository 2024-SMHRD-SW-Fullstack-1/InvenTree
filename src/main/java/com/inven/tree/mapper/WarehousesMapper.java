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
    
	//회사코드로 창고정보 추출 (재고현황 때문에 추가한 메소드) 
    Warehouses selectWarehouseByBidlName(String bidlName);
    
    //창고인덱스로 창고정보 추출(재고 현황 때문에 추가한 메소드)
    Warehouses selectWarehouseById(Integer whIdx);
}

