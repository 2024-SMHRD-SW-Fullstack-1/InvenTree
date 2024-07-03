package com.inven.tree.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryStatus {

	//제품 식별자
	@JsonProperty("prodIdx")
	private int prodIdx;

	//제품 바코드
	@JsonProperty("prodBarcode")
	private String prodBarcode;

	//제품명
	@JsonProperty("prodName")
	private String prodName;

	//제품 수량
	@JsonProperty("prodCnt")
	private int prodCnt;

	//제품 정보
	@JsonProperty("prodInfo")
	private String prodInfo;

	//창고이름
	@JsonProperty("bidlName")
	private String bidlName;

	//선반이름
	@JsonProperty("shelfId")
	private String shelfId;

	//랙이름
	@JsonProperty("rackId")
	private String rackId;

	//회사 식별자
	@JsonProperty("corpIdx")
	private String corpIdx;

	//선반 식별자
	@JsonProperty("shelfIdx")
	private Integer shelfIdx;

	//창고 식별자
	@JsonProperty("whIdx")
	private Integer whIdx;
	
	//행 식별자
	@JsonProperty("rowIdx")
	private int rowIdx; // 추가된 행 인덱스
}
