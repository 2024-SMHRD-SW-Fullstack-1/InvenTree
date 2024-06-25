package com.inven.tree.mapper;

import java.sql.Timestamp;
import java.util.List;

<<<<<<< HEAD
import org.apache.ibatis.annotations.Mapper;
=======
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Products;

<<<<<<< HEAD
@Mapper
public interface ProductsMapper {

    List<Products> selectProductsByCorpIdx(@Param("corpIdx") String corpIdx);

    String selectCorpIdxByName(@Param("corpName") String corpName);

    Integer selectProdIdxByBarcode(@Param("prodBarcode") String prodBarcode);

    void insertStock(@Param("corpIdx") String corpIdx, @Param("prodIdx") Integer prodIdx, @Param("prodCnt") Integer prodCnt, @Param("stockedAt") Timestamp stockedAt, @Param("subIdx") Integer subIdx);

    void updateProductCount(@Param("prodIdx") Integer prodIdx, @Param("prodCnt") Integer prodCnt);

=======
public interface ProductsMapper {
    String selectCorpIdxByName(@Param("corpIdx") String corpIdx);
    Integer selectProdIdxByBarcode(@Param("prodBarcode") String prodBarcode);
    void insertStock(@Param("corpIdx") String corpIdx, @Param("prodIdx") int prodIdx, @Param("stockCnt") int stockCnt, @Param("stockedAt") Timestamp stockedAt);
    void insertRelease(@Param("corpIdx") String corpIdx, @Param("prodIdx") int prodIdx, @Param("releaseCnt") int releaseCnt, @Param("releasedAt") Timestamp releasedAt);
    void updateProductCount(@Param("prodIdx") Integer prodIdx, @Param("prodCnt") Integer prodCnt);
>>>>>>> de1af2c2ec8d46f767daf91bcf994fd12640878f
    List<Products> selectAllProducts();
}
