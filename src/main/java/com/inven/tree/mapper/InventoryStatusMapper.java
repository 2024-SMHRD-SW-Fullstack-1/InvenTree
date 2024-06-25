package com.inven.tree.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.InventoryStatus;

public interface InventoryStatusMapper {
	// 사용자의 회사코드로 재고정보 불러오기
	List<InventoryStatus> findByCorpIdx(@Param("corpIdx") String corpIdx);

	// 새로운 재고 입력
	void insert(@Param("inventoryStatus") InventoryStatus inventoryStatus);

	// 기존 재고 정보 업데이트(수정)
	void update(@Param("inventoryStatus") InventoryStatus inventoryStatus);

	// 재고 삭제 기능
	void delete(@Param("prodBarcode") String prodBarcode);

	// 바코드 있는 재고 정보 계산 메소드 (오류 확인용)
	boolean existsByProdBarcode(@Param("prodBarcode") String prodBarcode);
}
