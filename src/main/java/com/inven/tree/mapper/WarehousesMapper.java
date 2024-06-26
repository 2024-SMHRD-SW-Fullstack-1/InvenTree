package com.inven.tree.mapper;

import com.inven.tree.model.Warehouses;

import java.util.List;

import org.apache.ibatis.annotations.Param;

public interface WarehousesMapper {

	// corpIdx로 창고 조회
    List<Warehouses> selectAllWarehouses(@Param("corpIdx") String corpIdx);
    
    // 창고 삭제
    void deleteWarehouses(@Param("warehouseIds") List<Integer> warehouseIds);
    
    // 창고 정보 변경
    void updateWarehouses(Warehouses warehouses);
    
    // 창고 추가
    void insertWarehouses(Warehouses warehouses);

	//회사코드로 창고정보 추출 (재고현황 때문에 추가한 메소드) 
    Warehouses selectWarehouseByBidlName(String bidlName);
    
    //창고인덱스로 창고정보 추출(재고 현황 때문에 추가한 메소드)
    Warehouses selectWarehouseById(Integer whIdx);


}