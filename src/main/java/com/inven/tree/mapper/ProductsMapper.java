package com.inven.tree.mapper;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Products;

public interface ProductsMapper {
    String selectCorpIdxByName(@Param("corpIdx") String corpIdx);
    Integer selectProdIdxByBarcode(@Param("prodBarcode") String prodBarcode);
    void insertStock(@Param("corpIdx") String corpIdx, @Param("prodIdx") int prodIdx, @Param("stockCnt") int stockCnt, @Param("stockedAt") Timestamp stockedAt);
    void insertRelease(@Param("corpIdx") String corpIdx, @Param("prodIdx") int prodIdx, @Param("releaseCnt") int releaseCnt, @Param("releasedAt") Timestamp releasedAt);
    void updateProductCount(@Param("prodIdx") Integer prodIdx, @Param("prodCnt") Integer prodCnt);
    List<Products> selectAllProducts();
}
