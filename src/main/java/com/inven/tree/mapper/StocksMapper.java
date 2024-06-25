package com.inven.tree.mapper;

import java.sql.Timestamp;
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
    void insertStock(@Param("corpIdx") String corpIdx, @Param("prodIdx") int prodIdx,
                     @Param("stockCnt") int stockCnt, @Param("stockedAt") Timestamp stockedAt);

    // 사용자의 회사코드로 입고 정보 불러오기
    List<Stocks> selectStocksByIds(@Param("list") List<Integer> stockIds);

    // 사용자의 회사 코드와 날짜로 입고 정보 불러오는 메소드
    List<Stocks> selectByCorpIdxAndDate(@Param("corpIdx") String corpIdx, @Param("year") int year,
                                        @Param("month") int month, @Param("prodIdx") Integer prodIdx);

    // 입출고내역 중 입고 내역 필터링 및 페이징 메소드
    List<Map<String, Object>> selectStocksWithDetailsFiltered(@Param("offset") int offset, @Param("size") int size,
                                                              @Param("filterColumn") String filterColumn, @Param("filterValue") String filterValue,
                                                              @Param("corpIdx") String corpIdx);

    // 입출고내역 페이지 수 계산 메소드
    int countFilteredEntries(@Param("filterColumn") String filterColumn, @Param("filterValue") String filterValue,
                             @Param("corpIdx") String corpIdx);
}
