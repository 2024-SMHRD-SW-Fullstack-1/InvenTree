package com.inven.tree.mapper;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Releases;

@Mapper
public interface ReleasesMapper {

	// 출고 등록 저장 메소드
	void insertRelease(@Param("corpIdx") String corpIdx, @Param("prodIdx") int prodIdx,
			@Param("releaseCnt") int releaseCnt, @Param("releasedAt") Timestamp releasedAt);
	// 출고 정보 모두 불러오는 메소드
	List<Releases> selectAllReleases();

	// 사용자의 회사 코드로 출고 정보 불러오는 메소드
	List<Releases> selectReleasesByIds(@Param("list") List<Integer> ids);

	// 출고 등록 저장 메소드(매개변수 틀림)
	void insertRelease(@Param("corpIdx") String corpIdx, @Param("prodIdx") Integer prodIdx,
			@Param("releaseCnt") Integer releaseCnt, @Param("releasedAt") Timestamp releasedAt,
			@Param("subIdx") Integer subIdx);

	// 입출고내역 중 출고 내역 필터링 및 페이징 메소드
	List<Map<String, Object>> selectReleasesWithDetailsFiltered(@Param("offset") int offset, @Param("size") int size,
			@Param("filterColumn") String filterColumn, @Param("filterValue") String filterValue,
			@Param("corpIdx") String corpIdx);

	// 입출고내역 페이징 페이지 수 계산 메소드
	int countFilteredEntries(@Param("filterColumn") String filterColumn, @Param("filterValue") String filterValue,
			@Param("corpIdx") String corpIdx);
	
	 // 오늘 날짜의 출고 데이터를 가져오는 메소드
    List<Releases> findTodayReleasesByCorpIdx(@Param("corpIdx") String corpIdx);
    
    // 회사 코드로 전체 데이터를 가져오는 메소드
    List<Releases> findReleasesByCorpIdx(@Param("corpIdx") String corpIdx);
}
