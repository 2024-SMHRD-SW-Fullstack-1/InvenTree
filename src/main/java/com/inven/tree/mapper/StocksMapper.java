package com.inven.tree.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Stocks;

@Mapper
public interface StocksMapper {
	// 모든 입고 정보 불러오기
	List<Stocks> selectAllStocks();

	// 입고 등록(저장)
	void insertStock(Stocks stock);

	// 사용자의 회사코드로 입고 정보 불러오기
	List<Stocks> selectStocksByIds(@Param("list") List<Integer> stockIds);

	// 입출고내역 중 입고내역 필터링 및 페이징 메소드
	List<Map<String, Object>> selectStocksWithDetailsFiltered(@Param("offset") int offset, @Param("size") int size,
			@Param("filterColumn") String filterColumn, @Param("filterValue") String filterValue,
			@Param("corpIdx") String corpIdx);

	// 입출고내역 페이지 수 계산 메소드
	int countFilteredEntries(@Param("filterColumn") String filterColumn, @Param("filterValue") String filterValue,
			@Param("corpIdx") String corpIdx);
}
