package com.inven.tree.mapper;

import com.inven.tree.model.Shelves;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.transaction.annotation.Transactional;


public interface ShelvesMapper {
    // 모든 선반 정보 불러오기
    List<Shelves> selectAllShelves();
    
    // 창고식별자로 선반 정보 불러오기 
    List<Shelves> selectAllShelvesBywhIdx(@Param("loginWhIdx") List<Integer> whIds);
    
    // 창고 식별자로 선반 데이터 삭제(shelfIdx)
    void deleteShelvesByShelfIdxAndWhIdx(@Param("loginShelfIdx") List<Integer> shelfIds,@Param("loginWhIdx") List<Integer> whIds);
    
    // 선반 정보 변경
    void updateShelf(Shelves shelves);

    // 선반 정보 추가
    void insertShelf(Shelves shelves);

    // 회사코드로 선반정보 추출(재고현황 선반 정보 불러오기 때문에 추가한 메소드
    List<Shelves> findByCorpIdx(String corpIdx);

    // 선반 정보 삭제
	void deleteShelves(List<Integer> ids);

	// 재고현황 때문에 추가
	List<Shelves> selectShelfByShelfId(String shelfId);
	
	// 재고 현황 때문에 추가
	List<Shelves> selectShelvesByWhIdx(Integer whIdx);
	
    // Shelves count 메서드
    int countShelvesByWhIdx(List<Integer> whIdx);
	
    // 선반을 삭제하는 메서드
    void deleteShelf(@Param("shelfId") int shelfId);

    // 창고 ID로 선반 목록을 조회하는 메서드
    List<Shelves> findByWarehouseId(@Param("whIdx") int whIdx);
    
    // 선반 ID로 선반을 조회하는 메서드
    Shelves findByShelfIdx(@Param("shelfIdx") int shelfIdx);

    // 선반에 제품을 추가하는 메서드
    void addProductToRack(@Param("shelfIdx") int shelfIdx, @Param("rackId") String rackId, @Param("prodIdx") Integer prodIdx);

}
