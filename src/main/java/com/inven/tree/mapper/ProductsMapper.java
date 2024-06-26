package com.inven.tree.mapper;

import java.sql.Timestamp;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.inven.tree.model.Products;

@Mapper
public interface ProductsMapper {

	// 사용자 회사 인덱스로 상품 추출
	List<Products> selectProductsByCorpIdx(String corpIdx);

	// 회사명으로 회사인덱스 추출
	String selectCorpIdxByName(@Param("corpName") String corpName);

	 // 상품바코드로 상품인덱스 추출
    Integer selectProdIdxByBarcode(@Param("prodBarcode") String prodBarcode);

	// 입고 등록 insert 메소드
	void insertStock(@Param("corpIdx") String corpIdx, @Param("prodIdx") Integer prodIdx,
			@Param("prodCnt") Integer prodCnt, @Param("stockedAt") Timestamp stockedAt,
			@Param("subIdx") Integer subIdx);

	// 재고 수량 수정 메소드
	void updateProductCount(@Param("prodIdx") Integer prodIdx, @Param("prodCnt") Integer prodCnt);

	// 모든 상품정보 가져오는 메소드 (회사코드 상관 없이)
	List<Products> selectAllProducts();

	// 재고현황으로 인해 추가된 메소드들
	
	
    boolean existsByProdBarcode(String prodBarcode);
    void updateProduct(Products product);
    void insertProduct(Products product);
    void deleteProductByBarcode(String prodBarcode);
}
