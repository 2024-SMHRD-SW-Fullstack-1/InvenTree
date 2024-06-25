package com.inven.tree.mapper;

import com.inven.tree.model.Warehouses;

import java.util.List;

public interface WarehousesMapper {
	// 모든 창고 정보 불러오기
    List<Warehouses> allWarehouses();
    
    void deleteWarehouses(List<Integer> ids);

	void addWarehouse(Warehouses warehouse);

	void updateWarehouse(Warehouses warehouse);
}
