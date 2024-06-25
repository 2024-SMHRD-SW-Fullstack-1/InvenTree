package com.inven.tree.mapper;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Stocks;

@Mapper
public interface StocksMapper {
    void insertStock(@Param("corpIdx") String corpIdx, @Param("prodIdx") int prodIdx, @Param("stockCnt") int stockCnt, @Param("stockedAt") Timestamp stockedAt);
    List<Stocks> selectAllStocks();
    List<Stocks> selectByCorpIdxAndDate(@Param("corpIdx") String corpIdx, @Param("year") int year, @Param("month") int month, @Param("prodIdx") Integer prodIdx);
    List<Map<String, Object>> selectStocksWithDetailsFiltered(
        @Param("offset") int offset,
        @Param("size") int size,
        @Param("filterColumn") String filterColumn,
        @Param("filterValue") String filterValue
    );
    int countFilteredEntries(
        @Param("filterColumn") String filterColumn,
        @Param("filterValue") String filterValue
    );
}
