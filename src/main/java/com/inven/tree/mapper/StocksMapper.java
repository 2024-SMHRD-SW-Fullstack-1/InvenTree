package com.inven.tree.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Stocks;

@Mapper
public interface StocksMapper {

    List<Stocks> selectAllStocks();

    void insertStock(Stocks stock);

    List<Stocks> selectStocksByIds(@Param("list") List<Integer> stockIds);

<<<<<<< HEAD
    List<Map<String, Object>> selectStocksWithDetailsFiltered(@Param("offset") int offset,
            @Param("size") int size,
            @Param("filterColumn") String filterColumn,
            @Param("filterValue") String filterValue,
            @Param("corpIdx") String corpIdx);

int countFilteredEntries(@Param("filterColumn") String filterColumn,
@Param("filterValue") String filterValue,
@Param("corpIdx") String corpIdx);
=======
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
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
}
