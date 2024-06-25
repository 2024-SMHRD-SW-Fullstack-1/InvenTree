package com.inven.tree.mapper;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Products;

@Mapper
public interface ProductsMapper {

    List<Products> selectProductsByCorpIdx(@Param("corpIdx") String corpIdx);

    String selectCorpIdxByName(@Param("corpName") String corpName);

    Integer selectProdIdxByBarcode(@Param("prodBarcode") String prodBarcode);

    void insertStock(@Param("corpIdx") String corpIdx, @Param("prodIdx") Integer prodIdx, @Param("prodCnt") Integer prodCnt, @Param("stockedAt") Timestamp stockedAt, @Param("subIdx") Integer subIdx);

    void updateProductCount(@Param("prodIdx") Integer prodIdx, @Param("prodCnt") Integer prodCnt);

    List<Products> selectAllProducts();
}
