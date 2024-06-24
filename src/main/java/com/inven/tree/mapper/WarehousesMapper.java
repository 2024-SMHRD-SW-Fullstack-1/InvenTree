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


}