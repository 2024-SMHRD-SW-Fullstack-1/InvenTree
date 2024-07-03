package com.inven.tree.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Warehouses;

public interface WarehousesMapper {

	// corpIdx로 창고등록(창고 & 선반) 테이블 출력
	List<Warehouses> getWarehousesAndShelvesByCorpIdx(String corpIdx);

	// 창고 삭제
	void deleteWarehouses(@Param("loginWhIdx") List<Integer> whIds);

	// 창고 정보 변경
	void updateWarehouse(Warehouses warehouses);

	// 창고 추가
	@Insert("INSERT INTO warehouses (corp_idx, bidl_name, mb_id, wh_addr, wh_status) VALUES (#{corpIdx}, #{bidlName},#{mbId}, #{whAddr}, #{whStatus})")
	@Options(useGeneratedKeys = true, keyProperty = "whIdx")
	void insertWarehouse(Warehouses warehouses);

	// 모든 창고 정보 불러오기
	List<Warehouses> allWarehouses();

	// corpIdx로 창고 조회
	List<Warehouses> selectAllWarehouses(@Param("corpIdx") String corpIdx);

	// 창고 추가
	void addWarehouse(Warehouses warehouse);

	// 회사코드로 창고정보 추출 (재고현황 때문에 추가한 메소드)
	Warehouses selectWarehouseByBidlName(String bidlName);

	// 창고인덱스로 창고정보 추출(재고 현황 때문에 추가한 메소드)
	Warehouses selectWarehouseById(Integer whIdx);
	
	// 회사 ID로 창고와 선반 정보를 조회하는 메서드
	List<Map<String, Object>> selectWarehousesAndShelvesMap(@Param("corpIdx") String corpIdx);
	
}
