package com.inven.tree.mapper;

import com.inven.tree.model.Warehouses;

import java.util.List;

<<<<<<< HEAD
public interface WarehousesMapper {
	// 모든 창고 정보 불러오기
    List<Warehouses> allWarehouses();
    
    void deleteWarehouses(List<Integer> ids);

	void addWarehouse(Warehouses warehouse);

	void updateWarehouse(Warehouses warehouse);
	
//	회사코드로 창고 추출 
	  List<Warehouses> findByCorpIdx(String corpIdx);
}
=======
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
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
