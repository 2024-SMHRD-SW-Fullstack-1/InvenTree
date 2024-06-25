package com.inven.tree.mapper;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Products;

@Mapper
public interface ProductsMapper {
    // 사용자 회사 인덱스로 상품 추출
    List<Products> selectProductsByCorpIdx(@Param("corpIdx") String corpIdx);

    // 회사명으로 회사인덱스 추출
    String selectCorpIdxByName(@Param("corpName") String corpName);

    // 상품바코드로 상품인덱스 추출
    Integer selectProdIdxByBarcode(@Param("prodBarcode") String prodBarcode);

    // 입고 등록 insert 메소드
    void insertStock(@Param("corpIdx") String corpIdx, @Param("prodIdx") Integer prodIdx,
                     @Param("prodCnt") Integer prodCnt, @Param("stockedAt") Timestamp stockedAt,
                     @Param("subIdx") Integer subIdx);

    // 출고 등록 insert 메소드
    void insertRelease(@Param("corpIdx") String corpIdx, @Param("prodIdx") int prodIdx,
                       @Param("releaseCnt") int releaseCnt, @Param("releasedAt") Timestamp releasedAt);

    // 재고 수량 수정 메소드
    void updateProductCount(@Param("prodIdx") Integer prodIdx, @Param("prodCnt") Integer prodCnt);

    // 모든 상품 정보 가져오는 메소드 (회사 코드 상관 없이)
    List<Products> selectAllProducts();

    // 상품명으로 상품 추출
    Products selectProductByName(@Param("productName") String productName);

    // 상품명 대소문자 무시하고 상품 추출
    Products selectProductByNameIgnoreCase(@Param("prodName") String prodName);

    // 상품 ID로 상품 추출
    Products selectProductById(@Param("prodIdx") int prodIdx);

    // 필터로 상품 추출
    List<Products> selectProductsByFilter(@Param("filterType") String filterType, @Param("filterValue") String filterValue);

    // 회사 인덱스와 날짜로 상품 추출
    List<Products> selectByCorpIdxAndDate(@Param("corpIdx") String corpIdx, @Param("startDate") Timestamp startDate, @Param("endDate") Timestamp endDate);

    // 회사 인덱스로 상품 코드 추출
    List<String> selectProductCodesByCorpIdx(@Param("corpIdx") String corpIdx);

    // 회사 인덱스로 상품명 추출
    List<String> selectProductNamesByCorpIdx(@Param("corpIdx") String corpIdx);

    // 회사 인덱스로 회사명 추출
    List<String> selectCompaniesByCorpIdx(@Param("corpIdx") String corpIdx);

    // 특정 컬럼과 회사 인덱스로 중복 제거된 데이터 추출
    List<String> selectDistinctByColumnAndCorpIdx(@Param("column") String column, @Param("corpIdx") String corpIdx);

    // 월별 재고 및 출고 데이터 추출
    List<Map<String, Object>> selectMonthlyStockAndReleaseData(@Param("year") int year,
                                                               @Param("corpIdx") String corpIdx,
                                                               @Param("filterType") String filterType,
                                                               @Param("filterValue") String filterValue);
}
