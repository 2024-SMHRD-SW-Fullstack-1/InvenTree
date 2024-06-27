package com.inven.tree.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.transaction.annotation.Transactional;

import com.inven.tree.model.Shelves;

public interface ShelvesMapper {

// 창고 식별자로 창고 & 선반 정보 불러오기
	List<Shelves> selectAllShelves();

// 창고 식별자로 선반 정보 불러오기
	List<Shelves> selectAllShelvesBywhIdx(@Param("warehouseIdsToDelete") List<Integer> whIdx);

// 선반 식별자로 선반 데이터 삭제(shelfIdx)
	@Transactional
	void deleteShelvesByShelfIdxAndWhIdx(@Param("shelfIdsToDelete") List<Integer> shelfIds,
			@Param("warehouseIdsToDelete") List<Integer> whIds);

// 선반 정보 변경 또는 추가
	void updateShelf(Shelves shelves);

// 선반 정보 삭제
	@Transactional
	void deleteShelves(List<Integer> ids);

// 회사코드로 선반정보 추출(재고현황 선반 정보 불러오기 때문에 추가한 메소드)
	List<Shelves> findByCorpIdx(String corpIdx);

// 재고현황 때문에 추가
	Shelves selectShelfByShelfId(String shelfId);

// 재고 현황 때문에 추가
	List<Shelves> selectShelvesByWhIdx(Integer whIdx);
	// 재고 현황 때문에 추가
	    Shelves selectShelfById(Integer shelfIdx);
	// 재고 현황 때문에 추가
	    Integer findShelfIdxByShelfId(String shelfId);
	
	
}
