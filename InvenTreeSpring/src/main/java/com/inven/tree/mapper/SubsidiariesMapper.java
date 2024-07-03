package com.inven.tree.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.inven.tree.model.Subsidiaries;

public interface SubsidiariesMapper {

	// 사용자의 회사코드로 입고업체 불러오는 메소드
	List<Subsidiaries> selectIncomingSubsidiariesByCorpIdx(@Param("corpIdx") String corpIdx);

	// 사용자의 회사코드로 출고업체 불러오는 메소드
	List<Subsidiaries> selectOutgoingSubsidiariesByCorpIdx(@Param("corpIdx") String corpIdx);

	// 계열사명으로 계열사 인덱스 추출하는 메소드(입고 업체인지 출고업체인지 구별해서)
	Integer selectSubIdxByName(@Param("subName") String subName, @Param("isRelease") String isRelease);

	// 계열사 인덱스로 계열사명 추출하는 메소드(입고 업체인지 출고업체인지 구별해서)
	String selectSubNameBySubIdx(@Param("subIdx") int subIdx, @Param("isRelease") String isRelease);

	// 모든 계열사정보 불러오기
	List<Subsidiaries> selectAllSubsidiary();
	
	// 회사코드로 등록된 업체
	List<Subsidiaries> selectSubsidiaryByCorpIdx(String corpIdx);
	
	// 업체 정보 변경
	void updateSubsidiary(Subsidiaries subsidiaries);
	
	// 업체 정보 추가 
	void insertSubsidiary(Subsidiaries subsidiaries);
	
	// 업체 정보 삭제
	void deleteSubsidiary(Subsidiaries subsidiaries);

    // 계열사명 대소문자 무시하고 추출
    List<Subsidiaries> selectSubsidiaryByNameIgnoreCase(@Param("subName") String subName);

    // 특정 컬럼과 회사 인덱스로 중복 제거된 데이터 추출
    List<String> selectDistinctByColumnAndCorpIdx(@Param("column") String column, @Param("corpIdx") String corpIdx);

    // 계열사명으로 계열사 인덱스 추출
    @Select("SELECT sub_idx FROM subsidiary WHERE sub_name = #{subName}")
    List<Integer> selectSubIdxByCompanyName(@Param("subName") String subName);

}
