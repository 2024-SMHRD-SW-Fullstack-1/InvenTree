package com.inven.tree.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.InventoryStatus;

public interface InventoryStatusMapper {
	List<InventoryStatus> findByCorpIdx(@Param("corpIdx") String corpIdx);
    void insert(@Param("inventoryStatus") InventoryStatus inventoryStatus);
    void update(@Param("inventoryStatus") InventoryStatus inventoryStatus);
    void delete(@Param("prodBarcode") String prodBarcode);
    boolean existsByProdBarcode(@Param("prodBarcode") String prodBarcode);
}
	 

