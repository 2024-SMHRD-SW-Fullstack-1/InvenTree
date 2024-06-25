package com.inven.tree.mapper;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Products;

@Mapper
public interface ProductsMapper {
    String selectCorpIdxByName(@Param("corpIdx") String corpIdx);
    Integer selectProdIdxByBarcode(@Param("prodBarcode") String prodBarcode);
    void insertStock(@Param("corpIdx") String corpIdx, @Param("prodIdx") int prodIdx, @Param("stockCnt") int stockCnt, @Param("stockedAt") Timestamp stockedAt);
    void insertRelease(@Param("corpIdx") String corpIdx, @Param("prodIdx") int prodIdx, @Param("releaseCnt") int releaseCnt, @Param("releasedAt") Timestamp releasedAt);
    void updateProductCount(@Param("prodIdx") Integer prodIdx, @Param("prodCnt") Integer prodCnt);
    List<Products> selectAllProducts();
    Products selectProductByName(@Param("productName") String productName);
    List<Products> selectProductsByCorpIdx(@Param("corpIdx") String corpIdx);
    List<String> selectProductCodesByCorpIdx(@Param("corpIdx") String corpIdx);
    List<String> selectProductNamesByCorpIdx(@Param("corpIdx") String corpIdx);
    List<String> selectCompaniesByCorpIdx(@Param("corpIdx") String corpIdx);
    List<String> selectDistinctByColumnAndCorpIdx(@Param("column") String column, @Param("corpIdx") String corpIdx);
    List<Products> selectByCorpIdxAndDate(@Param("corpIdx") String corpIdx, @Param("startDate") Timestamp startDate, @Param("endDate") Timestamp endDate);
    Products selectProductByNameIgnoreCase(@Param("prodName") String prodName);
    Products selectProductById(@Param("prodIdx") int prodIdx); // 추가된 메서드
    List<Products> selectProductsByFilter(@Param("filterType") String filterType, @Param("filterValue") String filterValue); // 추가된 메서드
    List<Map<String, Object>> selectMonthlyStockAndReleaseData(
            @Param("year") int year, 
            @Param("corpIdx") String corpIdx, 
            @Param("filterType") String filterType, 
            @Param("filterValue") String filterValue);
}

