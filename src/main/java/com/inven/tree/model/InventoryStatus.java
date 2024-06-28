package com.inven.tree.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryStatus {

	@JsonProperty("prodIdx")
	private int prodIdx;

	@JsonProperty("prodBarcode")
	private String prodBarcode;

	@JsonProperty("prodName")
	private String prodName;

	@JsonProperty("prodCnt")
	private int prodCnt;

	@JsonProperty("prodInfo")
	private String prodInfo;

	@JsonProperty("bidlName")
	private String bidlName;

	@JsonProperty("shelfId")
	private String shelfId;

	@JsonProperty("rackId")
	private String rackId;

	@JsonProperty("corpIdx")
	private String corpIdx;

	@JsonProperty("shelfIdx")
	private Integer shelfIdx;

	@JsonProperty("whIdx")
	private Integer whIdx;
	
	@JsonProperty("rowIdx")
	private int rowIdx; // 추가된 행 인덱스
}
